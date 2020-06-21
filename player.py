from flask_socketio import SocketIO, send, emit, join_room, leave_room
from vector import Vector
from gameelement import GameElement
from bullet import Bullet
import math
from enum import Enum, auto
from shield import Shield
from melee import Melee


class Player(GameElement):

    DASH_SPEED = 400
    TOP_SPEED = 150
    BULLET_SPEED = 500
    RADIUS = 20
    SHOT_COOLDOWN = 0.05
    DASH_COOLDOWN = 1

    class AttackMode(Enum):
        BLOCKING = auto()
        SHOOTING = auto()

    def __init__(self, x=0, y=0, vx=0, vy=0):
        super().__init__(x, y, vx, vy)
        self.oldVel = self.vel
        self.input = {}
        self.input['left'] = False
        self.input['right'] = False
        self.input['up'] = False
        self.input['down'] = False
        self.input['shot'] = False
        self.input['dash'] = False
        self.wasMoving = False
        self.active = True
        self.bullets = []
        self.indicators = {'dash': True, 'mode': 'shooting'}
        self.radius = Player.RADIUS
        self.cooldownS = 0  # Player.SHOT_COOLDOWN
        self.dashCool = 0  # Player.DASH_COOLDOWN
        self.mouseDir = Vector(1, 0)
        self.attackMode = Player.AttackMode.SHOOTING
        self.shield = Shield(self.pos, self.radius * 1.2)
        self.melee = Melee(self.pos, self.radius * 1.8)

    def handleInput(self, input):
        self.input = input

    def handleMouse(self, mouseX, mouseY):
        self.mouseDir = (Vector(mouseX, mouseY).sub(
            self.pos.cpy())).nor()

    def processAttack(self, delta):
        if (self.attackMode == Player.AttackMode.SHOOTING):
            if (self.cooldownS == 0 and self.input['shot']):
                self.cooldownS = Player.SHOT_COOLDOWN
                self.bullets.append(
                    Bullet(self.pos.cpy().add(self.mouseDir.cpy().times(self.radius)),
                           self.mouseDir.getAngle(), Player.BULLET_SPEED))
                self.setAttackMode(Player.AttackMode.BLOCKING)
                self.input['shot'] = False
        else:
            self.shield.setActive(self.input['shield'])
            self.shield.setAngle(self.mouseDir.getAngle())
            if (self.cooldownS == 0 and self.input['shot']):
                # TODO: Code for melee and successful melee
                self.cooldown = Player.SHOT_COOLDOWN
                self.melee.setActive()
            self.melee.update(delta)
            if not self.melee.isActive():
                self.melee.setAngle(self.mouseDir.getAngle())

    def setAttackMode(self, mode):
        self.attackMode = mode
        if self.attackMode == Player.AttackMode.SHOOTING:
            self.indicators['mode'] = 'shooting'
        elif self.attackMode == Player.AttackMode.BLOCKING:
            self.indicators['mode'] = 'blocking'
        if (self.shield.isActive()):
            self.shield.setActive(False)
        if (self.melee.isActive()):
            self.melee.setActive(False)
            self.input['shot'] = False

    def update(self, delta):
        self.oldVel = self.vel
        self.cooldownS = max(self.cooldownS - delta, 0)
        self.dashCool = max(self.dashCool - delta, 0)
        self.pos.add(self.vel.cpy().times(delta))
        # if (self.isMoving() and not self.wasMoving):
        #     self.setSpeed(max(Player.DASH_SPEED, self.oldVel.mag()))
        # elif self.vel.mag() <= Player.TOP_SPEED and self.isMoving():
        #     self.setSpeed(Player.TOP_SPEED)
        if self.isMoving():
            if (self.input['dash'] and self.dashCool == 0):
                self.setSpeed(max(Player.DASH_SPEED, self.oldVel.mag()))
                self.dashCool = Player.DASH_COOLDOWN
            elif (self.vel.mag() <= Player.TOP_SPEED):
                self.setSpeed(Player.TOP_SPEED)
        self.wasMoving = self.isMoving()
        self.vel.times(0.94)
        self.processAttack(delta)

        # UPDATE INDICATORS
        if self.dashCool == 0:
            self.indicators['dash'] = True
        else:
            self.indicators['dash'] = False

        for b in self.bullets:
            b.update(delta)
            if (not b.inBounds()):
                self.bullets.remove(b)

    def goBack(self, delta):
        self.pos.sub(self.oldVel.cpy().times(delta))

    def kill(self):
        self.active = False

    def isActive(self):
        return self.active

    def getRadius(self):
        return self.radius

    def getPos(self):
        return self.pos

    def collides(self, player):
        return self.pos.cpy().sub(player.pos).mag() <= \
            self.radius + player.getRadius()

    def isMoving(self):
        return self.input['left'] or self.input['right'] or self.input['up'] or self.input['down']

    def getX(self):
        return self.pos.x

    def getY(self):
        return self.pos.y

    def getVel(self):
        return self.vel

    def getMelee(self):
        return self.melee

    def setPosRelative(self, additionVector):
        self.pos.add(additionVector)

    def setPos(self, v):
        self.pos.setVec(v)

    def getShield(self):
        return self.shield

    def setVel(self, v):
        self.vel.setVec(v)

    def setSpeed(self, speed):
        if self.input['left']:
            self.vel.setVal(x=-speed)
        elif self.input['right']:
            self.vel.setVal(x=speed)

        if self.input['up']:
            self.vel.setVal(y=speed)
        elif self.input['down']:
            self.vel.setVal(y=-speed)

    def getBullets(self):
        return self.bullets

    def jsonify(self):
        return {
            'x': self.getX(),
            'y': self.getY(),
            'radius': self.radius,
            'shield': self.shield.jsonify(),
            'melee': self.melee.jsonify(),
            'active': self.active,
            'bullets': [b.jsonify() for b in self.bullets],
            # {'dash': self.dashInd, 'mode': self.attackMode}
            'indicators': self.indicators
        }
