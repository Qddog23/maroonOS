import requests
import random
from flask_cors import CORS
from flask import Flask, jsonify
from flask import send_file
from flask import after_this_request
import tempfile
from dotenv import load_dotenv
import os

global devMode, status, job, info, version, apiKey, count, printerInfo

load_dotenv(override=True)

ipAddress = os.getenv('IP_ADDRESS')
apiKey = os.getenv('API_KEY')
printerInfo = {
    "name": os.getenv('PRINTER_NAME'),
    "firmware": os.getenv('FIRMWARE'),
}

count = 0       # Used in dev mode to cycle through different states

devMode = True  # Set to True to run in development mode (works offline or when pi/printer isn't available)
cycleStates = False  # Set to True to cycle through different printer states when dev mode is True

status = {
    "job": {
        "id":43, 
        "progress": 28.00, 
        "time_remaining": 7560, 
        "time_printing": 3302
    }, 
    "storage": {
        "path": "/usb/", 
        "name": "usb", 
        "read_only": "false"
    }, 
    "printer": {
        "state": "PRINTING",
        "temp_bed": 60.0,
        "target_bed": 60.0,
        "temp_nozzle": 220.1,
        "target_nozzle": 220.0,
        "axis_z":4.3, 
        "flow": 100,
        "speed": 100, 
        "fan_hotend": 4098,
        "fan_print": 6314,
    }
}

job = {
    "id": 43,
    "state": "PRINTING",
    "progress": 30.00,
    "time_remaining": 7440,
    "time_printing": 3472,
    "file": {
        "refs": {
            "icon": "/thumb/s/usb/AMPSTA~1.BGC",
            "thumbnail": "/thumb/l/usb/AMPSTA~1.BGC",
            "download": "/usb/AMPSTA~1.BGC",
        },
        "name":"AMPSTA~1.BGC",
        "display_name": "Amp Station Blue_0.4n_0.1mm_PLA_MK4IS_2h58m.bgcode:",
        "path": "/usb",
        "size":0,
        "m_timestamp": 1704831009,
    }
}

app = Flask(__name__)
CORS(app)

def liveProgress():
    return random.uniform(0, 100)

def liveFan():
    return random.randint(0, 4000)

def liveNozzle():
    return random.uniform(20, 230)

def liveBed():
    return random.uniform(20, 80)

@app.route('/')
def hello():
    return 'Hello, World!'

@app.route('/status')
def getStatus():
    global count, ipAddress
    if devMode:
        if cycleStates:
            count += 1
            if count == 3:
                status['printer']['state'] = 'PRINTING'
            elif count == 6:
                status['printer']['state'] = 'IDLE'
                count = 0
        status['printer']['temp_nozzle'] = liveNozzle()
        status['printer']['temp_bed'] = liveBed()
        status['printer']['target_nozzle'] = liveNozzle()
        status['printer']['target_bed'] = liveBed()
        status['printer']['speed'] = liveProgress()
        status['printer']['fan_hotend'] = liveFan()
        status['printer']['fan_print'] = liveFan()
        return jsonify(status)
    else:
        headers = {'X-Api-Key': apiKey}
        response = requests.get(f'http://{ipAddress}/api/v1/status', headers=headers)
        return response.text
    
@app.route('/job')
def getJob():
    global ipAddress
    if devMode:
        job['progress'] = liveProgress()
        job['time_remaining'] = 12
        job['time_printing'] = 123
        return jsonify(job)
    else:
        headers = {'X-Api-Key': apiKey}
        response = requests.get(f'http://{ipAddress}/api/v1/job', headers=headers)
        return response.text

@app.route('/info')
def getInfo():
    return jsonify(printerInfo)
    
@app.route('/thumbnail')
def getThumbnail():
    global ipAddress
    if devMode:
        # return send_file('../frontends/assets/RobocubsLogo.png', mimetype='image/png')
        return send_file('../docs/ThumbnailDemo.png', mimetype='image/png')
    else:
        headers = {'X-Api-Key': apiKey}
        response = requests.get(f'http://{ipAddress}/api/v1/job', headers=headers)
        response = response.json()
        imagePath = response['file']['refs']['thumbnail']
        response = requests.get(f'http://{ipAddress}{imagePath}', headers=headers)
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp:
            temp.write(response.content)
            temp_path = temp.name

        @after_this_request
        def removeTemp(response):
            try:
                os.remove(temp_path)
            except Exception as error:
                app.logger.error("Error removing or closing downloaded image file: %s", error)
            return response
        
        return send_file(temp_path, mimetype='image/png')

if __name__ == '__main__':
    from waitress import serve
    serve(app, host="127.0.0.1", port=8002)