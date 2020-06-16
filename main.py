from flask import Flask, render_template, request
from flask_socketio import SocketIO, send, emit, join_room, leave_room
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
    return render_template('index.html')


@app.route('/user', methods=["GET"])
def name():
    try:
        return users[request.args.get('socketid')][0]
    except:
        return ""


@socketio.on('push')
def test_message(id, message):
    emit("pull",
         users[id][0] + ": " + message + "<br>", broadcast=True,
         room=users[id][1])


@socketio.on('new user')
def add_user(id, name):
    if not id in users:
        users[id] = [name, None]
        emit('new user success')
    else:
        emit('already registered', 'You are already registered!')


@socketio.on('new room')
def add_room(id, room):
    if not id in users:
        emit('error')
        return
    elif not room in rooms:
        rooms[room] = [users[id][0]]
        games[room] = Game(socketio)
        emit('new game', room=room)
    else:
        rooms[room].append(users[id][0])
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
def leave(id):
    games[users[id][1]].leave(id)
    leave_room(users[id][1])
    emit('someone else left', users[id][0] +
         ' has left the room.<br>', room=users[id][1])
    emit('left', "You left the room.<br>")
    rooms[users[id][1]].remove(users[id][0])
    if (rooms[users[id][1]] == []):
        rooms[users[id][1]] = []
    users[id][1] = None


if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port="5000")
