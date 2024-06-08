radio.onReceivedData(function (receivedData) {
    if (radio.isBetriebsart(receivedData, radio.e0Betriebsart.p0)) {
    	
    }
})
kran_e.beimStart(239, 90)
loops.everyInterval(700, function () {
    if (radio.timeout(1000)) {
        kran_e.rgbLEDon(kran_e.eRGBled.a, 0x000000, false)
        kran_e.rgbLEDs(kran_e.eRGBled.b, 0x0000ff, true)
    }
})
