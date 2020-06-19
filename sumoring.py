from gameelement import GameElement
from math import sqrt

class Sumoring(GameElement):
    
    def __init__(self, x=250, y=250, r=250):
        super().__init__(x,y)
        self.radius = r #(r*math.sqrt(2))/2
    
    def update(self, delta):
        #if delta<self.radius: # when server starts, delta hUgE and then later set to 0 and everything fine
        self.radius = max(self.radius - delta, 0)

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