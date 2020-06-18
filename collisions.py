

class Collisions:
    def __init__(self):
        pass

    def update(self, players):
        pass
        # plist = [players[k] for k in players]
        # for i in range(len(plist)):
        #     for o in range(i + 1, len(plist)):
        #         p = plist[i]
        #         p2 = plist[o]
        #         if p != p2 and p.collides(p2):
        #             diffVec = p.getPos().cpy().sub(p2.getPos()).nor()
        #             dist = p.getPos().dist(p2.getPos())
        #             v1 = p.getVel().mag()
        #             v2 = p2.getVel().mag()
        #             totalVel = v1 + v2
        #             p.setPosRelative(diffVec.cpy().times(dist * v1/totalVel))
        #             p2.setPosRelative(diffVec.cpy().times(-dist * v2/totalVel))
