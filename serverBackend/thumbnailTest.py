import requests
from flask_cors import CORS
from flask import Flask
from flask import send_file
from flask import after_this_request
import tempfile
import os

global devMode, status, job, info, version, apiKey, count

ipAddress = '192.168.88.253'
apiKey = 'hGRAQBPRi38myCs'

app = Flask(__name__)
CORS(app)

@app.route('/')
def test():

    @after_this_request
    def testAfter(response):
        print('Hello Dan!')
        return response
    
    return 'Hello Dan!'

@app.route('/withSendFile')
def sendFile():
    global ipAddress

    headers = {'X-Api-Key': apiKey}
    response = requests.get(f'http://{ipAddress}/api/v1/job', headers=headers)
    response = response.json()
    imagePath = response['file']['refs']['thumbnail']
    return send_file(f'http://{ipAddress}{imagePath}', mimetype='image/png')
    
@app.route('/withReturn')
def withReturn():
    global ipAddress

    headers = {'X-Api-Key': apiKey}
    response = requests.get(f'http://{ipAddress}/api/v1/job', headers=headers)
    response = response.json()
    imagePath = response['file']['refs']['thumbnail']
    response = requests.get(f'http://{ipAddress}{imagePath}', headers=headers)
    return response.content


### THIS WORKS ###
@app.route('/withTemp')
def withTemp():
    global ipAddress

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

def createServer():
    return app

if __name__ == '__main__':
    from waitress import serve
    serve(app, host="127.0.0.1", port=9001)