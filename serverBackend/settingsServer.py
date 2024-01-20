from flask_cors import CORS
from flask import Flask

global devMode

devMode = True  # Set to True to run in development mode (works offline or when pi/printer isn't available)

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'connected'


def createServer():
    return app

if __name__ == '__main__':
    from waitress import serve
    serve(app, host="0.0.0.0", port=8000)