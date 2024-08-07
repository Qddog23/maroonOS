from flask_cors import CORS
from flask import Flask
from apscheduler.schedulers.background import BackgroundScheduler
import subprocess

global devMode

devMode = False  # Set to True to run in development mode (works offline or when robocubs/printer isn't available)

app = Flask(__name__)
CORS(app)

def checkUpdates():
    subprocess.run(["sh", "/home/robocubs/maroonOS/server/pullUpdates.sh"])

# scheduler = BackgroundScheduler()
# # scheduler.add_job(func=checkUpdates, trigger="cron", hour="0", minute="0")
# scheduler.add_job(func=checkUpdates, trigger="interval", minutes=1)
# scheduler.start()

@app.route('/')
def hello_world():
    return 'connected'


def createServer():
    return app

if __name__ == '__main__':
    from waitress import serve
    serve(app, host="0.0.0.0", port=8000)