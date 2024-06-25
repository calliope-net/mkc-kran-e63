radio.onReceivedData(function (receivedData) {
    if (radio.getSchalter(receivedData, radio.e0Schalter.b7)) {
        control.reset()
    }
    if (radio.isBetriebsart(receivedData, radio.e0Betriebsart.p0)) {
        receiver.motor255(receiver.eMotor01.M0, radio.getByte(receivedData, radio.eBufferPointer.m0, radio.eBufferOffset.b0_Motor))
        receiver.servo_set16(radio.getByte(receivedData, radio.eBufferPointer.m0, radio.eBufferOffset.b1_Servo))
        receiver.qMotorChipPower(receiver.eMotorChip.ab, radio.getaktiviert(receivedData, radio.e3aktiviert.ma) || radio.getaktiviert(receivedData, radio.e3aktiviert.mb))
        receiver.qMotor255(receiver.eMotor.ma, radio.getByte(receivedData, radio.eBufferPointer.ma, radio.eBufferOffset.b0_Motor))
        receiver.qMotor255(receiver.eMotor.mb, radio.getByte(receivedData, radio.eBufferPointer.mb, radio.eBufferOffset.b0_Motor))
        receiver.qMotorChipPower(receiver.eMotorChip.cd, radio.getaktiviert(receivedData, radio.e3aktiviert.mc))
        receiver.qMotor255(receiver.eMotor.mc, radio.getByte(receivedData, radio.eBufferPointer.mc, radio.eBufferOffset.b0_Motor))
        receiver.ringTone(radio.getSchalter(receivedData, radio.e0Schalter.b0))
        receiver.qwiicRelay(radio.getSchalter(receivedData, radio.e0Schalter.b1))
        receiver.rgbLEDs(receiver.eRGBled.a, 0x0000ff, true)
    }
    if (receiver.chStatus() && radio.getSchalter(receivedData, radio.e0Schalter.b6)) {
        radio.sendString(receiver.getStatus(true))
    }
    radio.zeige5x5Status(receivedData)
})
receiver.beimStart(90)
loops.everyInterval(700, function () {
    if (radio.timeout(1000)) {
        receiver.rgbLEDs(receiver.eRGBled.a, 0x00ff00, true, 5)
        receiver.qMotorChipPower(receiver.eMotorChip.ab, false)
        receiver.qMotorChipPower(receiver.eMotorChip.cd, false)
    }
})
