#!/bin/sh
cd /home/robocubs/maroonOS/server
sudo /home/robocubs/maroonOS/server/venv/bin/python3 server.py &
sudo /home/robocubs/maroonOS/server/venv/bin/python3 settingsServer.py &
cd /