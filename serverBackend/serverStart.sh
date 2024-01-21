#!/bin/sh
# navigate to home directory, then to this directory, then execute python scripts, then back home

cd /
cd home/pi/maroonOS/serverBackend
sudo python3 server.py &
sudo python3 settingsServer.py &
cd /