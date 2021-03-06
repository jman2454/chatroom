from flask import Flask, render_template, request
from flask_socketio import SocketIO, send, emit, join_room, leave_room, close_room
import json
from game import Game

app = Flask(__name__)
app.config['SECRET_KEY'] = 'bruh'
socketio = SocketIO(app)

users = {}

rooms = {}

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
    if not game_id in rooms:
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
        users[id] = [name, None]
        emit('new user success')
    else:
        emit('already registered', 'You are already registered!')


# @socketio.on('join game from link')
# def join_game(socket_id, room_id):
#     return render_template('index.html', linked=True, id=socket_id, room=room_id)


@socketio.on('new room')
def add_room(id, room):
    if not id in users:
        emit('error')
        return
    elif not room in rooms:
        rooms[room] = [id]
        games[room] = Game(socketio, room)
        emit('new game', room=room)
    else:
        rooms[room].append(id)
    games[room].addPlayer(id)
    users[id][1] = room
    join_room(room)
    data = {}
    data['msg'] = users[id][0] + ' has entered the room!<br>'
    data['room'] = room
    emit('joined', json.dumps(data),
         room=room)
    games[room].start()


@socketio.on('leave room')
def leave(id, room):
    leave_room(room)
    if id is None:
        return
    if (games[room].leave(id, room)):
        game = games.pop(room, None)
        game.end()
        del game
    emit('someone else left', users[id][0] +
         ' has left the room.<br>', room=users[id][1])
    emit('left', "You left the room.<br>")
    rooms[room].remove(id)
    if (rooms[room] == []):
        close_room(room)
        rooms.pop(room, None)
    users[id][1] = None


if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port="5000")
