radio.onReceivedData(function (receivedData) {
    if (radio.getSchalter(receivedData, radio.e0Schalter.b7)) {
        control.reset()
    }
    if (radio.isBetriebsart(receivedData, radio.e0Betriebsart.p0)) {
        kran_e.motor255(Motor.M0, radio.getByte(receivedData, radio.eBufferPointer.m0, radio.eBufferOffset.b0_Motor))
        kran_e.servo_set16(radio.getByte(receivedData, radio.eBufferPointer.m0, radio.eBufferOffset.b1_Servo))
        kran_e.qMotorChipPower(kran_e.eMotorChip.ab, radio.getaktiviert(receivedData, radio.e3aktiviert.ma) || radio.getaktiviert(receivedData, radio.e3aktiviert.mb))
        kran_e.qMotor255(kran_e.eMotor.ma, radio.getByte(receivedData, radio.eBufferPointer.ma, radio.eBufferOffset.b0_Motor))
        kran_e.qMotor255(kran_e.eMotor.mb, radio.getByte(receivedData, radio.eBufferPointer.mb, radio.eBufferOffset.b0_Motor))
        kran_e.qMotorChipPower(kran_e.eMotorChip.cd, radio.getaktiviert(receivedData, radio.e3aktiviert.mc))
        kran_e.qMotor255(kran_e.eMotor.mc, radio.getByte(receivedData, radio.eBufferPointer.mc, radio.eBufferOffset.b0_Motor))
        kran_e.hupe(radio.getSchalter(receivedData, radio.e0Schalter.b0))
        kran_e.turnRelay(radio.getSchalter(receivedData, radio.e0Schalter.b1))
        kran_e.rgbLEDs(kran_e.eRGBled.a, 0x0000ff, true)
    }
    if (kran_e.chStatus() && radio.getSchalter(receivedData, radio.e0Schalter.b6)) {
        radio.sendString(kran_e.getStatus())
    }
})
kran_e.beimStart(239, 90)
basic.showLeds(`
    . . . . #
    . . # # .
    . . # . .
    # # # # #
    . # . # .
    `)
loops.everyInterval(700, function () {
    if (radio.timeout(1000)) {
        kran_e.rgbLEDs(kran_e.eRGBled.a, 0x00ff00, true)
        kran_e.qMotorChipPower(kran_e.eMotorChip.ab, false)
        kran_e.qMotorChipPower(kran_e.eMotorChip.cd, false)
    }
})
