from vector import Vector


class GameElement:

    bounds = Vector(1, 1)

    def __init__(self, x, y, vx=0, vy=0):
        self.pos = Vector(x, y)
        self.vel = Vector(vx, vy)

    def jsonify(self):
        return {'x': self.pos.x, 'y': self.pos.y}

    @staticmethod
    def setBounds(w, h):
        GameElement.bounds.setVal(w, h)

    def inBounds(self):
        return self.pos.x < self.bounds.x and self.pos.x > 0 and \
            self.pos.y < self.bounds.y and self.pos.y > 0
