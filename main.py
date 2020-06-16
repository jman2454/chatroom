from flask import Flask, render_template, request
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'bruh'
socketio = SocketIO(app)

users = {}


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/user', methods=["GET"])
def name():
    try:
        return users[request.args.get('socketid')]
    except:
        return ""


@socketio.on('push')
def test_message(id, message):
    emit("pull",
         users[id] + ": " + message + "<br>", broadcast=True)


@socketio.on('new user')
def add_user(id, name):
    if not id in users:
        print(name)
        users[id] = name
        emit('new user success')
    else:
        emit('already registered', 'You are already registered!')


if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port="5000")
