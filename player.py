from flask_socketio import SocketIO, send, emit, join_room, leave_room
from vector import Vector


class Player:
    def __init__(self, x=0, y=0, vx=0, vy=0):
        self.pos = Vector(x, y)
        self.vel = Vector(vx, vy)

    def handleInput(self, input):
        print("HANDLING IT BRUB")
        if input['left']:
            self.vel.setVal(x=-100)
        elif input['right']:
            self.vel.setVal(x=100)

        if input['up']:
            self.vel.setVal(y=100)
        elif input['down']:
            self.vel.setVal(y=-100)

    def update(self, delta):
        self.pos.add(self.vel.cpy().times(delta))
        self.vel.times(0.94)

    def getX(self):
        return self.pos.x

    def getY(self):
        return self.pos.y
