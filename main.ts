radio.onReceivedData(function (receivedData) {
    if (radio.getSchalter(receivedData, radio.e0Schalter.b7)) {
        control.reset()
    }
    if (radio.isBetriebsart(receivedData, radio.e0Betriebsart.p0)) {
        kran_e.motor255(Motor.M0, radio.getByte(receivedData, radio.eBufferPointer.m0, radio.eBufferOffset.b0_Motor))
        kran_e.servo_set16(radio.getByte(receivedData, radio.eBufferPointer.m0, radio.eBufferOffset.b1_Servo))
        kran_e.qMotorPower(kran_e.eMotor.ma, radio.getaktiviert(receivedData, radio.e3aktiviert.ma))
        kran_e.qMotor255(kran_e.eMotor.ma, radio.getByte(receivedData, radio.eBufferPointer.ma, radio.eBufferOffset.b0_Motor))
        kran_e.qMotorPower(kran_e.eMotor.mb, radio.getaktiviert(receivedData, radio.e3aktiviert.mb))
        kran_e.qMotor255(kran_e.eMotor.mb, radio.getByte(receivedData, radio.eBufferPointer.mb, radio.eBufferOffset.b0_Motor))
        kran_e.qMotorPower(kran_e.eMotor.mc, radio.getaktiviert(receivedData, radio.e3aktiviert.mc))
        kran_e.qMotor255(kran_e.eMotor.mc, radio.getByte(receivedData, radio.eBufferPointer.mc, radio.eBufferOffset.b0_Motor))
        kran_e.hupe(radio.getSchalter(receivedData, radio.e0Schalter.b0))
        kran_e.turnRelay(radio.getSchalter(receivedData, radio.e0Schalter.b1))
        kran_e.rgbLEDon(kran_e.eRGBled.a, 0xff0000, radio.getaktiviert(receivedData, radio.e3aktiviert.m0))
        kran_e.rgbLEDs(kran_e.eRGBled.b, 0x00ff00, true)
    }
    if (kran_e.chStatus() && radio.getSchalter(receivedData, radio.e0Schalter.b6)) {
        radio.sendString(kran_e.getStatus())
    }
})
kran_e.beimStart(239, 90)
basic.showLeds(`
    . . . . #
    . . . # .
    . . # . .
    # # # # #
    . # . # .
    `)
loops.everyInterval(700, function () {
    if (radio.timeout(1000)) {
        kran_e.rgbLEDon(kran_e.eRGBled.a, 0x000000, false)
        kran_e.rgbLEDs(kran_e.eRGBled.b, 0x0000ff, true)
    }
})
