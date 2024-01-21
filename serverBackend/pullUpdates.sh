#!/bin/sh
# navigate to home directory, then to this directory, then pull updates, then back home

cd /
cd home/pi/maroonOS

git pull

cd /
sudo reboot