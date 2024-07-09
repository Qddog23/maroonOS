#!/bin/sh

is_display_connected() {
    /usr/bin/xrandr | grep -q 'HDMI-0 connected\|HDMI-1 connected'
}

while ! is_display_connected; do
    sleep 1
done

/usr/bin/chromium-browser --noerrdialogs --disable-infobars --kiosk 'file:///home/pi/maroonOS/frontend/sleep.html'