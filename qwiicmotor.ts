
namespace kran_e { // qwiicmotor.ts

    // I²C Adresse Motor Modul
    //const i2cMotorAB = 0x5D
    //const i2cMotorCD = 0x5E

    export enum ei2cMotor { i2cMotorAB = 0x5D, i2cMotorCD = 0x5E }

    export enum eMotor {
        //% block="MA"
        ma = 0,
        //% block="MB"
        mb = 1,
        //% block="MC"
        mc = 2,
        //% block="MD"
        md = 3,
    }

    // Register
    const ID = 0x01 // Reports hard-coded ID byte of 0xA9
    const MA_DRIVE = 0x20 // 0x00..0xFF Default 0x80
    //const MB_DRIVE = 0x21
    const DRIVER_ENABLE = 0x70 //  0x01: Enable, 0x00: Disable this driver
    const FSAFE_CTRL = 0x1F // Use to configure what happens when failsafe occurs.
    const FSAFE_TIME = 0x76 // This register sets the watchdog timeout time, from 10 ms to 2.55 seconds.
    const STATUS_1 = 0x77 // This register uses bits to show status. Currently, only b0 is used.
    const CONTROL_1 = 0x78 // 0x01: Reset the processor now.

    const c_MotorStop = 128
    //let n_MotorChipABReady = false
    //let n_MotorChipCDReady = false
    let n_MotorChipReady = [false, false, false, false]
    let n_MotorPower = [false, false, false, false]
    let n_MotorSpeed = [c_MotorStop, c_MotorStop, c_MotorStop, c_MotorStop]
    // let n_MotorON = false       // aktueller Wert im Chip
    //  let n_MotorA = c_MotorStop  // aktueller Wert im Chip

    // group="Motor"
    // block="Motor Reset %i2cMotor" weight=9
    export function motorReset(i2cMotor: ei2cMotor) {
        switch (i2cMotor) {
            case ei2cMotor.i2cMotorAB: {
                n_MotorChipReady[eMotor.ma] = false
                n_MotorChipReady[eMotor.mb] = false
            }
            case ei2cMotor.i2cMotorCD: {
                n_MotorChipReady[eMotor.mc] = false
                n_MotorChipReady[eMotor.md] = false
            }
        }
        if (pins.i2cWriteBuffer(i2cMotor, Buffer.fromArray([ID]), true) != 0) {
            addStatusHEX(i2cMotor)
            return false
        } else if (pins.i2cReadBuffer(i2cMotor, 1).getUint8(0) == 0xA9) { // Reports hard-coded ID byte of 0xA9
            pins.i2cWriteBuffer(i2cMotor, Buffer.fromArray([CONTROL_1, 1])) // Reset the processor now.
            return true
        } else
            addStatusHEX(0x10 + i2cMotor)
        return false
    }

    function motorChipReady(pMotor: eMotor) {
        if (n_MotorChipReady[pMotor])
            return true
        else {
            let i2cMotor: ei2cMotor
            switch (pMotor) {
                case eMotor.ma, eMotor.mb: {
                    i2cMotor = ei2cMotor.i2cMotorAB
                    break
                }
                case eMotor.mc, eMotor.md: {
                    i2cMotor = ei2cMotor.i2cMotorCD
                    break
                }
            } // switch
            /*
            bool ready( void );
            This function checks to see if the SCMD is done booting and is ready to receive commands. Use this
            after .begin(), and don't progress to your main program until this returns true.
            SCMD_STATUS_1: Read back basic program status
                B0: 1 = Enumeration Complete
                B1: 1 = Device busy
                B2: 1 = Remote read in progress
                B3: 1 = Remote write in progress
                B4: Read state of enable pin U2.5"
            */
            n_MotorChipReady[pMotor] = (pins.i2cWriteBuffer(i2cMotor, Buffer.fromArray([STATUS_1]), true) == 0
                && (pins.i2cReadBuffer(i2cMotor, 1).getUint8(0) & 0x01) == 1) // STATUS_1

            return n_MotorChipReady[pMotor]
        } // else
    }


   


} // qwiicmotor.ts
