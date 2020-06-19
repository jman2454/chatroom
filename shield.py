from gameelement import GameElement
import math
from vector import Vector


class Shield(GameElement):
    def __init__(self, pos, radius):
        super().__init__(pos.x, pos.y)
        self.radius = radius
        self.angle = 0
        self.arcRange = math.pi/6
        self.active = False

    def jsonify(self):
        return {
            'angle': self.angle,
            'arc': self.arcRange,
            'active': self.active,
            'radius': self.radius
        }

    def isActive(self):
        return self.active

    def setAngle(self, angle):
        self.angle = angle

    def toggleActive(self):
        self.active = not self.active
        return self.active

    def setActive(self, active):
        self.active = active

    def collides(self, pPos, other):
        # angle = self.pos.cpy().sub(other.getPos()).getAngle()
        angle = other.getPos().cpy().sub(pPos).getAngle()
        # startAng = self.angle - self.arcRange/2
        # endAng = self.angle + self.arcRange/2
        if Vector.angleDiff(angle, self.angle) < self.arcRange:
            return pPos.dist(other.getPos()) <= self.radius + other.getRadius()
