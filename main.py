from flask import Flask, render_template, request
from flask_socketio import SocketIO, send, emit, join_room, leave_room, close_room
import json
from game import Game
from functools import reduce
# from engineio.payload import Payload

app = Flask(__name__)
app.config['SECRET_KEY'] = 'bruh'

# Payload.max_decode_packets = 500
# socketio = SocketIO(app, async_mode='gevent', ping_timeout=cfg.service.PING_TIMEOUT,
#                     ping_interval=cfg.service.PING_INTERVAL)

socketio = SocketIO(app, ping_timeout=3000, ping_interval=1000)
# socketio = SocketIO(app, async_mode='gevent', ping_timeout=60000,
#                     ping_interval=25000)


# users[id] = [<name>, <room>, <ready>]
users = {}

# # rooms[room_id] = [<u1>, <u2>, ..., <un>]
# rooms = {}

# games[room_id] = [<game1>, <game2>, ..., <gamen>]
games = {}


@app.route('/')
def index():
    return render_template('index.html', linked="false")


@app.route('/games')
def listActiveGames():
    return str([k for k in games])


@app.route('/user', methods=["GET"])
def name():
    try:
        return users[request.args.get('socketid')][0]
    except:
        return ""


@app.route('/game/<game_id>', methods=["GET"])
def join(game_id):
    if not game_id in games:
        return render_template('404.html')
    else:
        return render_template('index.html', linked="true", room_id=game_id)
        # rooms[game_id].append(users[id][0])


@socketio.on('push')
def test_message(id, message):
    if users[id][1] is None:
        return
    emit("pull",
         users[id][0] + ": " + message + "<br>",
         room=users[id][1])


@socketio.on('typing')
def typing(id, room):
    emit('client typing', id, room=room)


@socketio.on('new user')
def add_user(id, name):
    if not id in users:
        users[id] = [name, None, False]
        emit('new user success')
    else:
        emit('already registered', 'You are already registered!')


# @socketio.on('join game from link')
# def join_game(socket_id, room_id):
#     return render_template('index.html', linked=True, id=socket_id, room=room_id)

@socketio.on('connect')
def test_conn():
    print(request.sid + " Connected")


@socketio.on('disconnect')
def test_dis():
    print(request.sid + " Disconnected")


@socketio.on('new room')
def add_room(id, room):
    if not id in users:
        emit('error')
        return
    elif not room in games:
        # rooms[room] = [id]
        games[room] = Game(room)
        emit('new game', room=room)
    # else:
    #     rooms[room].append(id)
    games[room].addPlayer(id)
    users[id][1] = room
    join_room(room)
    data = {}
    data['msg'] = users[id][0] + ' has entered the room!<br>'
    data['room'] = room
    data['ready'] = [reduce(lambda acc, i: acc +
                            (1 if users[i][1] == room and users[i][2] else 0),
                            games[room].getPlayers(), 0),
                     len(games[room].getPlayers())]
    data['newUser'] = id
    data['isRunning'] = games[room].isRunning()
    emit('joined', json.dumps(data),
         room=room)


# @socketio.on('unready')
# def unReady(id, room):
#     users[id][2] = False
#     readyUsers = {
#         'ready': reduce(lambda acc, i: acc + 1 if users[i][2] else 0, users, 0),
#         'total': len(rooms[room])
#     }
#     emit('unreadied', json.dumps(readyUsers), room=room)


@socketio.on('readyup')
def readyUp(id, room):
    users[id][2] = True
    # room = users[id][1]
    processReadyUsers(room)


@socketio.on('mousemove')
def mouseMove(id, room, mouseInput):
    games[room].processCursor(id, mouseInput)


@socketio.on('keypress')
def keyPress(id, room, keyInput):
    games[room].processInput(id, keyInput)


def processReadyUsers(room):
    allReady = all([users[i][2] for i in games[room].getPlayers()])
    readyUsers = {
        'ready': reduce(lambda acc, i: acc + (1 if users[i][2] else 0), games[room].getPlayers(), 0),
        'total': len(games[room].getPlayers())
    }
    if not allReady:
        emit('readied', json.dumps(readyUsers), room=room, include_self=True)
    else:
        for i in games[room].getPlayers():
            users[i][2] = False
        emit('game start', room=room)
        games[room].start()


@socketio.on('leave room')
def leave(id, room):
    leave_room(room, sid=id)
    users[id][2] = False
    if (games[room].leave(id, room)):
        game = games.pop(room, None)
        game.end()
        del game
        close_room(room)
    emit('someone else left', users[id][0] +
         ' has left the room.<br>',
         room=users[id][1], include_self=False)
    emit('left', "You left the room.<br>")
    # rooms[room].remove(id)
    # if (rooms[room] == []):
    #     close_room(room)
    #     rooms.pop(room, None)
    users[id][1] = None
    processReadyUsers(room)


if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port="5000")
