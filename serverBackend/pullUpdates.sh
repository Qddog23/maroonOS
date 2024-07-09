#!/bin/sh
# navigate to home directory, then to this directory, then pull updates, then back home

cd /
cd home/pi/maroonOS

git fetch

if [ "$(git diff origin/main)" != "" ]; then
    git reset --hard origin/main
fi

chmod +x serverBackend/serverStart.sh
chmod +x serverBackend/pullUpdates.sh
chmod +x serverBackend/server.py
chmod +x serverBackend/settingsServer.py

sudo reboot