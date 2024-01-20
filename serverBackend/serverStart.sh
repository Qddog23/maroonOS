#!/bin/sh
# navigate to home directory, then to this directory, then execute python script, then back home

cd /
cd home/pi/PrinterStatusScreens/serverBackend
sudo python3 server.py &
sudo python3 settingsServer.py &
cd /