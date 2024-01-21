#!/bin/sh
# navigate to home directory, then to this directory, then pull updates, then back home

cd /
cd home/pi/maroonOS

git fetch

if [ "$(git diff origin/main)" != "" ]; then
    git pull
    sudo reboot
fi

cd /