from gameelement import GameElement
import math


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

    def setAngle(self, angle):
        self.angle = angle

    def toggleActive(self):
        self.active = not self.active
        return self.active

    def setActive(self, active):
        self.active = active
