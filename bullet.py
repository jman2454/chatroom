from gameelement import GameElement
from vector import Vector
import math


class Bullet(GameElement):

    BULLET_RADIUS = 4

    def __init__(self, position, direction, speed):
        super().__init__(position.x, position.y)
        self.vel = Vector(speed, 0)
        self.vel.setAngle(direction)
        self.radius = Bullet.BULLET_RADIUS
        self.deflected = False

    def setDeflected(self, d):
        self.deflected = d

    def getDeflected(self):
        return self.deflected

    def update(self, delta):
        self.pos.add(self.vel.cpy().times(delta))

    def jsonify(self):
        j = super().jsonify()
        j['radius'] = self.radius
        return j

    def getVel(self):
        return self.vel.cpy()

    def getPos(self):
        return self.pos

    def getRadius(self):
        return self.radius
