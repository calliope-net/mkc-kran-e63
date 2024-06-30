input.onButtonEvent(Button.A, input.buttonEventValue(ButtonEvent.Click), function () {
    storage.putNumber(StorageSlots.s1, radio.setFunkgruppeButton(radio.eFunkgruppeButton.minus))
})
input.onButtonEvent(Button.B, input.buttonEventValue(ButtonEvent.Click), function () {
    storage.putNumber(StorageSlots.s1, radio.setFunkgruppeButton(radio.eFunkgruppeButton.plus))
})
radio.onReceivedData(function (receivedData) {
    if (radio.isBetriebsart(receivedData, radio.e0Betriebsart.p0)) {
        receiver.motor255(receiver.eMotor01.M0, radio.getByte(receivedData, radio.eBufferPointer.m0, radio.eBufferOffset.b0_Motor))
        receiver.servo_set16(radio.getByte(receivedData, radio.eBufferPointer.m0, radio.eBufferOffset.b1_Servo))
        receiver.motor255(receiver.eMotor01.M1, radio.getByte(receivedData, radio.eBufferPointer.m1, radio.eBufferOffset.b0_Motor))
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
    radio.zeige5x5Buffer(receivedData)
    radio.zeige5x5Joystick(receivedData)
})
receiver.beimStart(receiver.eModell.v3, 90, storage.getNumber(StorageSlots.s1))
storage.putNumber(StorageSlots.s1, radio.setFunkgruppeButton(radio.eFunkgruppeButton.anzeigen))
loops.everyInterval(700, function () {
    if (radio.timeout(60000, true)) {
        receiver.pinRelay(false)
    } else if (radio.timeout(1000)) {
        receiver.rgbLEDs(receiver.eRGBled.a, 0x00ff00, true, 5)
        receiver.qMotorChipPower(receiver.eMotorChip.ab, false)
        receiver.qMotorChipPower(receiver.eMotorChip.cd, false)
    }
})
