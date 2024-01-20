#!/bin/sh
# start Chromium frontend

#[[ -z $DISPLAY && $XDG_VTNR -eq 1 ]] && startx -- -nocursor
#startx -- -nocursor

checkDisplay(){
    if [[ -z $DISPLAY && $XDG_VTNR -eq 1 ]]; then
        echo True
        return 0
    else
        echo False
        return 1
    fi
}

while true; do
    if [ "$(checkDisplay)" = True ]; then
        startx -- -nocursor
    fi
    sleep 1
done