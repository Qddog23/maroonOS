#!/bin/sh

is_desktop_logged_in() {
    pgrep gnome-session >/dev/null
}

while ! is_desktop_logged_in; do
    sleep 5
done

/usr/bin/chromium-browser --noerrdialogs --disable-infobars --kiosk 'file:///home/pi/maroonOS/frontend/sleep.html'