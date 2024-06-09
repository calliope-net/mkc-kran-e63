
namespace kran_e { // qwiicrelay.ts

    // I²C Adresse Single Relay
    const i2cRelay = 0x19

    const SINGLE_OFF = 0x00
    const SINGLE_ON = 0x01

    //% group="SparkFun Qwiic Single Relay"
    //% block="Magnet %pOn"
    //% pOn.shadow="toggleOnOff"
    export function turnRelay(pOn: boolean) {
        pins.i2cWriteBuffer(i2cRelay, Buffer.fromArray([pOn ? SINGLE_ON : SINGLE_OFF]))
    }

} // qwiicrelay.ts
