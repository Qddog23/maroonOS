#!/bin/sh

is_desktop_logged_in() {
    pgrep lxsession >/dev/null || pgrep xfwm4 >/dev/null
}

while ! is_desktop_logged_in; do
    sleep 5
done

/usr/bin/chromium-browser --noerrdialogs --disable-infobars --kiosk 'file:///home/pi/maroonOS/frontend/sleep.html'