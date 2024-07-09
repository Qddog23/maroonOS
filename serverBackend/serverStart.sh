#!/bin/sh

sudo /home/pi/maroonOS/serverBackend/venv/bin/python3 server.py &
sudo /home/pi/maroonOS/serverBackend/venv/bin/python3 settingsServer.py &
cd /