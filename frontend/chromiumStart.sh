#!/bin/sh

is_display_connected() {
    /usr/bin/xrandr | grep -q 'HDMI-0 connected\|HDMI-1 connected'
}

set_active_display() {
    local connected_displays=$(xrandr --query | grep ' connected' | awk '{ print $1 }')
    for display in $connected_displays; do
        if [[ $display == HDMI-0 || $display == HDMI-1 ]]; then
            export DISPLAY=":$display"
            echo "Display set to $DISPLAY"
            return
        fi
    done
    echo "No known display connected. Using default :0"
    export DISPLAY=:0
}

while ! is_display_connected; do
    sleep 1
done

set_active_display

/usr/bin/chromium-browser --noerrdialogs --disable-infobars --kiosk 'file:///home/pi/maroonOS/frontend/sleep.html'