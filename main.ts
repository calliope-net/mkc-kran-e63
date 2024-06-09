radio.onReceivedData(function (receivedData) {
    if (radio.getSchalter(receivedData, radio.e0Schalter.b7)) {
        control.reset()
    }
    if (radio.isBetriebsart(receivedData, radio.e0Betriebsart.p0)) {
    	
    }
    if (kran_e.chStatus() && radio.getSchalter(receivedData, radio.e0Schalter.b6)) {
        radio.sendString(kran_e.getStatus())
    }
})
kran_e.beimStart(239, 90)
basic.showLeds(`
    . . . . .
    . . . . .
    . . . . .
    # # # # #
    . # . # .
    `)
loops.everyInterval(700, function () {
	
})
