from gameelement import GameElement

class Sumoring(GameElement):
    
    def __init__(self, x=250, y=250, r=250):
        super().__init__(x,y)
        self.radius = r
    
    def update(self, delta):
        self.radius = self.radius - delta

    def getX(self):
        return self.pos.x
    
    def getY(self):
        return self.pos.y

    def inRing(self, player):
        return self.pos.dist(player.pos) < self.radius

    def jsonify(self):
        return {
            'x': self.getX(),
            'y': self.getY(),
            'radius': self.radius
        }