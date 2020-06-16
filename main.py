from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'bruh'
socketio = SocketIO(app)


@app.route('/')
def index():
    return render_template('index.html')


@socketio.on('message')
def test_message(message):
    print(message)
    send(message, broadcast=True)


if __name__ == '__main__':
    socketio.run(app)
