

class Collisions:
    def __init__(self):
        pass

    def playerCollisions(self, p1, others):
        for pID in others:
            if p1 != others[pID] and others[pID].collides(p1):
                diffVec = p1.getPos().cpy().sub(
                    others[pID].getPos()).nor()
                dist = p1.getRadius(
                ) + others[pID].getRadius()
                p1.setPos(
                    others[pID].getPos().cpy().add(diffVec.times(dist)))

    def bulletShield(self, player, players):
        if not player.getShield().isActive():
            return
        for pID in players:
            bullets = players[pID].getBullets()
            for b in bullets:
                if player.getShield().collides(player.getPos(), b):
                    b.vel.times(-1)
                    # player.setVel(b.getVel().times(-1))
                    # bullets.remove(b)
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