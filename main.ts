function deaktiviert (receivedData: any[]) {
    receiver.motor255(receiver.eMotor01.M0, radio.getByte(null, radio.eBufferPointer.m0, radio.eBufferOffset.b0_Motor))
    receiver.servo_set16(radio.getByte(null, radio.eBufferPointer.m0, radio.eBufferOffset.b1_Servo))
    receiver.motor255(receiver.eMotor01.M1, radio.getByte(null, radio.eBufferPointer.m1, radio.eBufferOffset.b0_Motor))
    receiver.qMotorChipPower(receiver.eMotorChip.ab, radio.getaktiviert(null, radio.e3aktiviert.ma) || radio.getaktiviert(null, radio.e3aktiviert.mb))
    receiver.qMotor255(receiver.eMotor.ma, radio.getByte(null, radio.eBufferPointer.ma, radio.eBufferOffset.b0_Motor))
    receiver.qMotor255(receiver.eMotor.mb, radio.getByte(null, radio.eBufferPointer.mb, radio.eBufferOffset.b0_Motor))
    receiver.qMotorChipPower(receiver.eMotorChip.cd, radio.getaktiviert(null, radio.e3aktiviert.mc))
    receiver.qMotor255(receiver.eMotor.mc, radio.getByte(null, radio.eBufferPointer.mc, radio.eBufferOffset.b0_Motor))
    receiver.qMotor255(receiver.eMotor.md, radio.getByte(null, radio.eBufferPointer.md, radio.eBufferOffset.b0_Motor))
}
radio.onReceivedData(function (receivedData) {
    if (radio.isBetriebsart(receivedData, radio.e0Betriebsart.p0)) {
        receiver.sendM0(receivedData)
        receiver.ringTone(radio.getSchalter(receivedData, radio.e0Schalter.b0))
        receiver.digitalWritePin(receiver.eDigitalPins.C16, !(radio.getSchalter(receivedData, radio.e0Schalter.b0)))
        receiver.qwiicRelay(radio.getSchalter(receivedData, radio.e0Schalter.b1))
        receiver.pinGPIO4(radio.getSchalter(receivedData, radio.e0Schalter.b2))
        receiver.rgbLEDs(receiver.eRGBled.a, 0x0000ff, true)
    }
    if (receiver.chStatus() && radio.getSchalter(receivedData, radio.e0Schalter.b6)) {
        radio.sendString(receiver.getStatus(true))
    }
    radio.zeige5x5Buffer(receivedData)
    radio.zeige5x5Joystick(receivedData)
})
input.onButtonEvent(Button.A, input.buttonEventValue(ButtonEvent.Hold), function () {
    radio.setFunkgruppeButton(radio.eFunkgruppeButton.minus)
    storage.putNumber(StorageSlots.s1, radio.storageBufferGet())
})
input.onButtonEvent(Button.B, input.buttonEventValue(ButtonEvent.Hold), function () {
    radio.setFunkgruppeButton(radio.eFunkgruppeButton.plus)
    storage.putNumber(StorageSlots.s1, radio.storageBufferGet())
})
receiver.beimStart(receiver.eModell.v3, 90, storage.getNumber(StorageSlots.s1))
storage.putNumber(StorageSlots.s1, radio.storageBufferGet())
lcd20x4.initLCD(lcd20x4.lcd20x4_eADDR(lcd20x4.eADDR.LCD_20x4))
lcd20x4.writeText(lcd20x4.lcd20x4_eADDR(lcd20x4.eADDR.LCD_20x4), 0, 0, 19, lcd20x4.lcd20x4_text("Calliope mini v3"))
lcd20x4.writeText(lcd20x4.lcd20x4_eADDR(lcd20x4.eADDR.LCD_20x4), 1, 0, 19, lcd20x4.lcd20x4_text("Maker Kit Car"))
loops.everyInterval(700, function () {
    if (radio.timeout(60000, true)) {
        receiver.pinRelay(false)
    } else if (radio.timeout(1000)) {
        receiver.rgbLEDs(receiver.eRGBled.a, 0x00ff00, true, 5)
        receiver.ringTone(false)
        receiver.qMotorChipPower(receiver.eMotorChip.ab, false)
        receiver.qMotorChipPower(receiver.eMotorChip.cd, false)
    }
})
