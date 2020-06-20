import math


class Vector:
    def __init__(self, x=0, y=0):
        self.x = x
        self.y = y

    def setVal(self, x=None, y=None):
        self.x = x or self.x
        self.y = y or self.y

    def setVec(self, v):
        self.x = v.x
        self.y = v.y

    def times(self, c):
        self.x *= c
        self.y *= c
        return self

    def cpy(self):
        return Vector(self.x, self.y)

    def add(self, x, y=None):
        if y is None:
            self.x += x.x
            self.y += x.y
        else:
            self.x += x
            self.y += y
        return self

    def sub(self, x, y=None):
        if y is None:
            self.add(x.cpy().times(-1))
        else:
            self.x -= x
            self.y -= y
        return self

    def setAngle(self, angle, degrees=False):
        mag = self.mag()
        self.x = mag * math.cos(math.degrees(angle) if degrees else angle)
        self.y = mag * math.sin(math.degrees(angle) if degrees else angle)
        return self

    def getAngle(self):
        return math.atan2(self.y, self.x)

    def mag(self):
        return (self.x*self.x + self.y*self.y) ** 0.5

    def dist(self, vec):
        return (((self.x - vec.x) ** 2) + ((self.y - vec.y) ** 2)) ** 0.5

    def nor(self):
        mag = self.mag()
        if mag == 0:
            self.x = 1
            self.y = 0
            return self
        self.x /= mag
        self.y /= mag
        return self

    @staticmethod
    def angleDiff(a1, a2):
        phi = abs(a2 - a1) % math.pi * 2
        return 2 * math.pi - phi if phi > math.pi else phi
