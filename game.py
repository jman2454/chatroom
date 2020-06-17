import time
import json
from player import Player
from flask_socketio import SocketIO, send, emit, join_room, leave_room


class Game:
    def __init__(self, socketio, room):
        self.currFrame = 0
        self.pastFrame = 0
        self.socketio = socketio
        self.players = {}
        self.room = room
        self.socketio.on_event('new player' + room, self.addPlayer)
        self.socketio.on_event('keypress' + room, self.processInput)

    def update(self, delta):
        for pID in self.players:
            self.players[pID].update(delta)

    def draw(self, delta):
        emit('update', json.dumps({k: {'x': v.getX(), 'y': v.getY()}
                                   for k, v in self.players.items()}),
             room=self.room)

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
        self.players[id] = Player(250, 250)

    def processInput(self, pid, input, room):
        # print THIS ROOM and the room name
        # print CLIENT ROOM and the room name
        # examine results while doing keypresses on a previously created room, after creating a new room on another tab
        # first = 4329379432
        # second = 4329468592
        # print(id(self))
        # print("THIS ROOM: " + self.room)
        # print("CLIENT ROOM: " + room)
        if (room == self.room):
            self.players[pid].handleInput(input)

    def start(self):
        self.render()

    def leave(self, id, room):
        if (room == self.room):
            self.players.pop(id, None)
            return len(self.players) == 0
