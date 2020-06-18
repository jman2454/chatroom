import time
import json
from player import Player
from flask_socketio import SocketIO, send, emit, join_room, leave_room
from gameelement import GameElement
from sumoring import Sumoring
from vector import Vector


class Game:
    def __init__(self, socketio, room):
        self.width = 500
        self.height = 500
        GameElement.setBounds(self.width, self.height)
        self.currFrame = 0
        self.pastFrame = 0
        self.socketio = socketio
        self.players = {}
        self.ring = Sumoring()
        self.room = room
        self.socketio.on_event('new player' + room, self.addPlayer)
        self.socketio.on_event('keypress' + room, self.processInput)
        self.socketio.on_event('mousemove' + room, self.processCursor)

    def update(self, delta):
        for pID in self.players:
            self.players[pID].update(delta)
            if (not self.ring.inRing(self.players[pID])):
                #self.leave(pID, self.room)
                self.players[pID]
        self.ring.update(delta)

    def draw(self, delta):
        dic = {}
        dic['players'] = {k: v.jsonify() for k, v in self.players.items()}
        dic['ring'] = self.ring.jsonify()
        emit('update', json.dumps(dic), room=self.room)

    def render(self):
        running = True
        while (running):
            self.pastFrame = self.currFrame
            self.currFrame = time.time()
            dt = self.currFrame - self.pastFrame
            sleepTime = 1./60 - dt
            if sleepTime > 0:
                time.sleep(sleepTime)
            self.update(dt)
            self.draw(dt)

    def addPlayer(self, id):
        self.players[id] = Player(self.width/2, self.height/2)

    def processInput(self, pid, input):
        # print THIS ROOM and the room name
        # print CLIENT ROOM and the room name
        # examine results while doing keypresses on a previously created room, after creating a new room on another tab
        # first = 4329379432
        # second = 4329468592
        # print(id(self))
        # print("THIS ROOM: " + self.room)
        # print("CLIENT ROOM: " + room)
        # if (room == self.room):
        self.players[pid].handleInput(input)

    def processCursor(self, pid, mouseInput):
        self.players[pid].handleMouse(
            mouseInput['mouseX'], self.height - mouseInput['mouseY']
        )

    def start(self):
        self.render()

    def leave(self, id, room):
        if (room == self.room):
            self.players.pop(id, None)
            return len(self.players) == 0
