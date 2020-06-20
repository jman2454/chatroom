from shield import Shield
import math
from vector import Vector


class Melee(Shield):
    def __init__(self, pos, radius):
        super().__init__(pos, radius)
        self.arcRange = math.pi/20
        self.angle = 0
        self.swingRange = math.pi/3
        self.swingTime = 0.2
        self.endAngle = self.angle
        self.startAngle = self.angle - self.swingRange / 2
        self.endAngle = self.angle + self.swingRange / 2

    def update(self, delta):

        if self.active:
            if Vector.angleDiff(self.angle + delta * self.swingRange /
                                self.swingTime, self.endAngle) >= \
                    Vector.angleDiff(self.angle, self.endAngle):
                self.angle = self.endAngle
                self.active = False
            else:
                self.angle += delta * self.swingRange / self.swingTime
                self.swingTime
                # newAng = min(self.angle + delta * self.swingRange /
                #              self.swingTime, self.angle + self.swingRange / 2)
                # if newAng == self.angle + self.swingRange / 2:
                #     self.active = False
                # self.angle = newAng
        else:
            self.startAngle = self.angle - self.swingRange / 2
            self.endAngle = self.angle + self.swingRange / 2

    def setActive(self, active=True):
        if not self.active:
            self.angle = self.startAngle
        self.active = active
