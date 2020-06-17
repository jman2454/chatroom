from flask_socketio import SocketIO, send, emit, join_room, leave_room
from vector import Vector


class Player:
    def __init__(self, x=0, y=0, vx=0, vy=0):
        self.pos = Vector(x, y)
        self.vel = Vector(vx, vy)
        self.input = {}
        self.input['left'] = False
        self.input['right'] = False
        self.input['up'] = False
        self.input['down'] = False

    def handleInput(self, input):
        self.input = input

    def update(self, delta):
        if self.input['left']:
            self.vel.setVal(x=-150)
        elif self.input['right']:
            self.vel.setVal(x=150)

        if self.input['up']:
            self.vel.setVal(y=150)
        elif self.input['down']:
            self.vel.setVal(y=-150)
        self.pos.add(self.vel.cpy().times(delta))
        self.vel.times(0.94)

    def getX(self):
        return self.pos.x

    def getY(self):
        return self.pos.y
