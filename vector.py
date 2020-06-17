class Vector:
    def __init__(self, x=0, y=0):
        self.x = x
        self.y = y

    def setVal(self, x=None, y=None):
        self.x = x or self.x
        self.y = y or self.y

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

    def dist(self, vec):
        return (((self.x - vec.x) ** 2) + ((self.y - vec.y) ** 2)) ** 0.5