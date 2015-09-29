# auto-light

This circuit is a simulation of an automatic lighting system that automatically illuminates a room when it's below a lighting threshold if it detects movement in the room.

The sensors used for this circuit are
* Photoresistor
* IR proximity sensor
* Button

The output/state of the system is provided via
* LED
* 7-segment display

All these components are attached to the Photon in the following layout:

![auto-light fritzing diagram](https://raw.githubusercontent.com/tonyjmnz/hcin720/master/ia2/fritzing/autolight.png)

## Circuit description

* Pin A1 receives photoresistor input
* Pin A3 receives IR proximity sensor input
* Pin A3 receives button input
* Pin A5 sends LED output
* Pins D0 through D6 provide output to the 7-segment display
