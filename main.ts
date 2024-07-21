input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    receiver.encoderStartStrecke(20)
    receiver.encoderSelectMotor(128)
})
input.onButtonEvent(Button.B, btf.buttonEventValue(ButtonEvent.Hold), function () {
    btf.buttonBhold()
})
btf.onReceivedData(function (receivedData) {
    if (btf.isBetriebsart(receivedData, btf.e0Betriebsart.p0Fahren)) {
        receiver.sendM0(receivedData)
        receiver.ringTone(btf.getSchalter(receivedData, btf.e0Schalter.b0))
        receiver.digitalWritePin(receiver.eDigitalPins.C16, !(btf.getSchalter(receivedData, btf.e0Schalter.b0)))
        receiver.writeQwiicRelay(btf.getSchalter(receivedData, btf.e0Schalter.b1))
        receiver.pinLicht(!(btf.getSchalter(receivedData, btf.e0Schalter.b2)))
        receiver.rgbLEDs(receiver.eRGBled.a, 0x0000ff, true)
        btf.zeige5x5Buffer(receivedData)
        btf.zeige5x5Joystick(receivedData)
    }
    lcd20x4.writeText(lcd20x4.lcd20x4_eADDR(lcd20x4.eADDR.LCD_20x4), 3, 14, 18, receiver.encoderCounter(receiver.eEncoderEinheit.cm), lcd20x4.eAlign.right)
})
input.onButtonEvent(Button.A, btf.buttonEventValue(ButtonEvent.Hold), function () {
    btf.buttonAhold()
})
receiver.beimStart(
receiver.eHardware.v3,
96,
true,
67
)
lcd20x4.initLCD(lcd20x4.lcd20x4_eADDR(lcd20x4.eADDR.LCD_20x4))
lcd20x4.writeText(lcd20x4.lcd20x4_eADDR(lcd20x4.eADDR.LCD_20x4), 0, 0, 19, lcd20x4.lcd20x4_text("Calliope mini v3"))
lcd20x4.writeText(lcd20x4.lcd20x4_eADDR(lcd20x4.eADDR.LCD_20x4), 1, 0, 19, lcd20x4.lcd20x4_text("Maker Kit Car"))
loops.everyInterval(500, function () {
    if (btf.timeout(60000, true)) {
        receiver.pinRelay(false)
    } else if (btf.timeout(1000)) {
        receiver.rgbLEDs(receiver.eRGBled.a, 0x00ff00, true, 5)
        receiver.ringTone(false)
        receiver.qwiicMotorChipPower(receiver.eQwiicMotorChip.ab, false)
        receiver.qwiicMotorChipPower(receiver.eQwiicMotorChip.cd, false)
        receiver.dualMotor128(receiver.eDualMotor.M0_M1, 128)
    }
})
