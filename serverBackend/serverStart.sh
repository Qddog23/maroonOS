#!/bin/sh
cd /home/pi/maroonOS/serverBackend
sudo /home/pi/maroonOS/serverBackend/venv/bin/python3 server.py &
sudo /home/pi/maroonOS/serverBackend/venv/bin/python3 settingsServer.py &
cd /