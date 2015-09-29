# auto-light

This circuit is a simulation of an automatic lighting system that automatically illuminates a room when it's below a lighting threshold if it detects movement in the room.

The sensors used for this circuit are
* Photoresistor
* IR proximity sensor
* Button

The output/state of the system is provided via
* LED
* 7-segment display

All these components are attached to the [Photon](https://store.particle.io/?product=particle-photon) in the following layout:

![auto-light fritzing diagram](https://raw.githubusercontent.com/tonyjmnz/hcin720/master/ia2/fritzing/autolight.png)
Diagram created using [Fritzing](http://fritzing.org/home/)

## Circuit description

* Pin A0 receives photoresistor input
* Pin A3 receives IR proximity sensor input
* Pin A3 receives button input
* Pin A5 sends LED output
* Pins D0 through D7 provide output to the 7-segment display

## System description

* Pressing the button will change the system mode between on, off and auto
* The 7-segment display will show 0 (off), 1 (on) or A (auto) depending on the system state
* The LED will turn on if the room is dark and the proximity sensor detects movement, it will turn off again if it doesn't detect movement for more than 10 seconds (for testing purposes)

## Visualization

The visualization for this project is entirely different from IA1. The visualizations were created using jQuery, HTML5 and some components from [umbrUI](https://github.com/simurai/umbrUI)

## Project structure

* [/sparkapp](https://github.com/tonyjmnz/hcin720/tree/master/ia2/sparkapp) - Contains all the photon-related code
* [/server](https://github.com/tonyjmnz/hcin720/tree/master/ia2/server)   - Node server that sends serialport data over websocket [source](https://github.com/hcin720-fall15/IA2)
* [/webapp](https://github.com/tonyjmnz/hcin720/tree/master/ia2/webapp)   - Contains all the visualization files
* [/fritzing](https://github.com/tonyjmnz/hcin720/tree/master/ia2/fritzing) - Contains the source of the fritzing diagram

## Libraries used
* [jQuery](https://github.com/jquery/jquery)
* [umbrUI](https://github.com/simurai/umbrUI)
* [socket.io](https://github.com/socketio/socket.io)
* [normalize.css](https://github.com/necolas/normalize.css/)
