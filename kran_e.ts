//% color=#007F00 icon="\uf0d1" block="Kran Empfänger" weight=06
namespace kran_e { // kran-e.ts


    export const pinServo = AnalogPin.P1           // 5V fischertechnik 132292 Servo
    export const pinEncoder = DigitalPin.P2        // 5V fischertechnik 186175 Encodermotor Competition

    const c_Simulator: boolean = ("€".charCodeAt(0) == 8364)
    let n_ready = false

    export const c_MotorStop = 128
    // export let n_MotorChipReady = false
    let n_MotorPower = false    // aktueller Wert im Chip Motor Power
    let n_Motor0 = c_MotorStop  // aktueller Wert im Chip
    let n_Motor1 = c_MotorStop  // aktueller Wert im Chip

    export const c_Servo_geradeaus = 90
    let n_ServoGeradeaus = c_Servo_geradeaus // Winkel für geradeaus wird beim Start eingestellt
    let n_ServoWinkel = c_Servo_geradeaus // aktuell eingestellter Winkel



    //% group="calliope-net.github.io/mkc-63"
    //% block="beim Start Funkgruppe %funkgruppe Servo ↑ %servoGeradeaus °" weight=8
    //% funkgruppe.min=0 funkgruppe.max=255 funkgruppe.defl=239
    //% servoGeradeaus.min=81 servoGeradeaus.max=99 servoGeradeaus.defl=90
    //% inlineInputMode=inline 
    export function beimStart(funkgruppe: number, servoGeradeaus: number) {
        n_ready = false // CaR4 ist nicht bereit: Schleifen werden nicht abgearbeitet

        relay(true) // Relais an schalten

        n_ServoGeradeaus = servoGeradeaus // Parameter
        pins.servoWritePin(pinServo, n_ServoGeradeaus)

        pins.setPull(pinEncoder, PinPullMode.PullUp) // Encoder PIN Eingang PullUp

        // in bluetooth.ts:
        radio.beimStart(funkgruppe)

        n_ready = true
    }


    // group="calliope-net.github.io/mkc-63"
    // block="Car bereit" weight=6
    export function carReady() {
        return n_ready //&& motorStatus()
    }



} // kran-e.ts