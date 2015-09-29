all: compile flash

compile:
	particle compile photon . --saveTo ./lighting.bin

flash:
	particle flash --usb lighting.bin
