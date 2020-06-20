from player import Player


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
                others[pID].getVel().add(diffVec.cpy().times(-5))

    def meleeCollisions(self, p1, others):
        if not p1.getMelee().isActive():
            return
        for pID in others:
            if others[pID] != p1 and \
                    p1.getMelee().collides(p1.getPos(), others[pID]):
                vV = others[pID].getPos().cpy().sub(p1.getPos()).nor()
                others[pID].setVel(vV.times(600))
                p1.setAttackMode(Player.AttackMode.SHOOTING)

    def bulletShield(self, player, players):
        for pID in players:
            bullets = players[pID].getBullets()
            for b in bullets:
                if not players[pID] == player and player.getShield().isActive() and \
                        player.getShield().collides(player.getPos(), b):
                    b.vel.times(-1)
                    b.setDeflected(True)
                    player.setAttackMode(Player.AttackMode.SHOOTING)
                    player.getShield().toggleActive()
                elif (not players[pID] == player or b.getDeflected()) and player.collides(b):
                    player.vel.setVec(b.getVel())
                    bullets.remove(b)
                    del b
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
