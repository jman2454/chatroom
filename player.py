from flask_socketio import SocketIO, send, emit, join_room, leave_room
from vector import Vector
from gameelement import GameElement
from bullet import Bullet
import math
from enum import Enum, auto
from shield import Shield


class Player(GameElement):

    DASH_SPEED = 400
    TOP_SPEED = 150
    BULLET_SPEED = 500
    RADIUS = 20
    SHOT_COOLDOWN = 0.05

    class AttackMode(Enum):
        BLOCKING = auto()
        SHOOTING = auto()

    def __init__(self, x=0, y=0, vx=0, vy=0):
        super().__init__(x, y, vx, vy)
        self.input = {}
        self.input['left'] = False
        self.input['right'] = False
        self.input['up'] = False
        self.input['down'] = False
        self.input['shot'] = False
        self.wasMoving = False
        self.bullets = []
        self.radius = Player.RADIUS
        self.cooldown = Player.SHOT_COOLDOWN
        self.mouseDir = Vector(1, 0)
        self.attackMode = Player.AttackMode.SHOOTING
        self.shield = Shield(self.pos, self.radius * 1.1)

    def handleInput(self, input):
        self.input = input

    def handleMouse(self, mouseX, mouseY):
        self.mouseDir = (Vector(mouseX, mouseY).sub(
            self.pos.cpy())).nor()

    def processAttack(self):
        if (self.attackMode == Player.AttackMode.SHOOTING):
            if (self.cooldown == 0 and self.input['shot']):
                self.cooldown = Player.SHOT_COOLDOWN
                self.bullets.append(
                    Bullet(self.pos.cpy().add(self.mouseDir.cpy().times(self.radius)),
                           self.mouseDir.getAngle(), Player.BULLET_SPEED))
                self.attackMode = Player.AttackMode.BLOCKING
        else:
            self.shield.setActive(self.input['shield'])

    def update(self, delta):
        self.cooldown = max(self.cooldown - delta, 0)
        self.pos.add(self.vel.cpy().times(delta))
        if (self.isMoving() and not self.wasMoving):
            self.setSpeed(Player.DASH_SPEED)
        elif self.vel.mag() <= Player.TOP_SPEED and self.isMoving():
            self.setSpeed(Player.TOP_SPEED)
        self.wasMoving = self.isMoving()
        self.vel.times(0.94)
        self.processAttack()

        for b in self.bullets:
            b.update(delta)
            if (not b.inBounds()):
                self.bullets.remove(b)

    def getRadius(self):
        return self.radius

    def isMoving(self):
        return self.input['left'] or self.input['right'] or self.input['up'] or self.input['down']

    def getX(self):
        return self.pos.x

    def getY(self):
        return self.pos.y

    def setSpeed(self, speed):
        if self.input['left']:
            self.vel.setVal(x=-speed)
        elif self.input['right']:
            self.vel.setVal(x=speed)

        if self.input['up']:
            self.vel.setVal(y=speed)
        elif self.input['down']:
            self.vel.setVal(y=-speed)

    def jsonify(self):
        return {
            'x': self.getX(),
            'y': self.getY(),
            'radius': self.radius,
            'bullets': [b.jsonify() for b in self.bullets]
        }
