#!/bin/sh
# navigate to home directory, then to this directory, then pull updates, then back home

cd /
cd home/pi/maroonOS

git fetch

if [ "$(git diff origin/main)" != "" ]; then
    git reset --hard origin/main
    sudo reboot
fi

cd /