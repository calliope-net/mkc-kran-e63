input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    receiver.encoder_start(100)
    receiver.selectEncoderMotor255(195)
})
radio.onReceivedData(function (receivedData) {
    if (radio.isBetriebsart(receivedData, radio.e0Betriebsart.p0)) {
        receiver.sendM0(receivedData)
        receiver.ringTone(radio.getSchalter(receivedData, radio.e0Schalter.b0))
        receiver.digitalWritePin(receiver.eDigitalPins.C16, !(radio.getSchalter(receivedData, radio.e0Schalter.b0)))
        receiver.qwiicRelay(radio.getSchalter(receivedData, radio.e0Schalter.b1))
        receiver.pinLicht(!(radio.getSchalter(receivedData, radio.e0Schalter.b2)))
        receiver.rgbLEDs(receiver.eRGBled.a, 0x0000ff, true)
        radio.zeige5x5Buffer(receivedData)
        radio.zeige5x5Joystick(receivedData)
    }
    lcd20x4.writeText(lcd20x4.lcd20x4_eADDR(lcd20x4.eADDR.LCD_20x4), 3, 14, 18, receiver.encoder_get(receiver.eEncoderEinheit.cm), lcd20x4.eAlign.right)
})
input.onButtonEvent(Button.A, input.buttonEventValue(ButtonEvent.Hold), function () {
    radio.setFunkgruppeButton(radio.eFunkgruppeButton.minus)
    storage.putNumber(StorageSlots.s1, receiver.storageBufferGet())
})
input.onButtonEvent(Button.B, input.buttonEventValue(ButtonEvent.Hold), function () {
    radio.setFunkgruppeButton(radio.eFunkgruppeButton.plus)
    storage.putNumber(StorageSlots.s1, receiver.storageBufferGet())
})
receiver.beimStart(
receiver.erModell.v3,
96,
true,
67,
true,
storage.getNumber(StorageSlots.s1)
)
storage.putNumber(StorageSlots.s1, receiver.storageBufferGet())
lcd20x4.initLCD(lcd20x4.lcd20x4_eADDR(lcd20x4.eADDR.LCD_20x4))
lcd20x4.writeText(lcd20x4.lcd20x4_eADDR(lcd20x4.eADDR.LCD_20x4), 0, 0, 19, lcd20x4.lcd20x4_text("Calliope mini v3"))
lcd20x4.writeText(lcd20x4.lcd20x4_eADDR(lcd20x4.eADDR.LCD_20x4), 1, 0, 19, lcd20x4.lcd20x4_text("Maker Kit Car"))
loops.everyInterval(500, function () {
    if (radio.timeout(60000, true)) {
        receiver.pinRelay(false)
    } else if (radio.timeout(1000)) {
        receiver.rgbLEDs(receiver.eRGBled.a, 0x00ff00, true, 5)
        receiver.ringTone(false)
        receiver.qMotorChipPower(receiver.eMotorChip.ab, false)
        receiver.qMotorChipPower(receiver.eMotorChip.cd, false)
    }
})
