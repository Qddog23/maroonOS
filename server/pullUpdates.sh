#!/bin/sh
# navigate to home directory, then to this directory, then pull updates, then back home

cd /
cd home/robocubs/maroonOS

git fetch

if [ "$(git diff origin/main)" != "" ]; then
    git reset --hard origin/main
fi

chmod +x server/serverStart.sh
chmod +x server/pullUpdates.sh
chmod +x server/server.py
chmod +x server/settingsServer.py

chmod +x frontends/regular/chromiumStart.sh


sudo reboot