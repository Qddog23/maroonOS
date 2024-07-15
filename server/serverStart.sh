#!/bin/sh
cd /home/pi/maroonOS/server
sudo /home/pi/maroonOS/server/venv/bin/python3 server.py &
sudo /home/pi/maroonOS/server/venv/bin/python3 settingsServer.py &
cd /