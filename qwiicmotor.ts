
namespace kran_e { // qwiicmotor.ts

    // I²C Adresse Motor Modul
    const i2cMotorAB = 0x5D
    const i2cMotorCD = 0x5E

    // export enum ei2cMotor { i2cMotorAB = 0x5D, i2cMotorCD = 0x5E }

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
    const MB_DRIVE = 0x21
    const DRIVER_ENABLE = 0x70 //  0x01: Enable, 0x00: Disable this driver
    const FSAFE_CTRL = 0x1F // Use to configure what happens when failsafe occurs.
    const FSAFE_TIME = 0x76 // This register sets the watchdog timeout time, from 10 ms to 2.55 seconds.
    const STATUS_1 = 0x77 // This register uses bits to show status. Currently, only b0 is used.
    const CONTROL_1 = 0x78 // 0x01: Reset the processor now.

    const c_MotorStop = 128
    let n_MotorChipReady = [false, false, false, false]
    let n_MotorPower = [false, false, false, false]
    let n_MotorSpeed = [c_MotorStop, c_MotorStop, c_MotorStop, c_MotorStop]



    //  let n_MotorReady = false
    //  let n_MotorON = false       // aktueller Wert im Chip
    //  let n_MotorA = c_MotorStop  // aktueller Wert im Chip

    // group="Motor"
    // block="Motor Reset %i2cMotor" weight=9
    /* export function motorReset(i2cMotor: ei2cMotor) {
        n_MotorReady = false
        if (pins.i2cWriteBuffer(i2cMotor, Buffer.fromArray([ID]), true) != 0) {
            addStatus(i2cMotor)
            return false
        } else if (pins.i2cReadBuffer(i2cMotor, 1).getUint8(0) == 0xA9) { // Reports hard-coded ID byte of 0xA9
            pins.i2cWriteBuffer(i2cMotor, Buffer.fromArray([CONTROL_1, 1])) // Reset the processor now.
            return true
        } else
            addStatus(i2cMotor + "A9")
        return false
    } */

    // group="Motor"
    // block="Motor bereit %i2cMotor" weight=8
    /*   function motorStatus(i2cMotor: ei2cMotor): boolean {
         if (n_MotorReady)
             return true
         
         bool ready( void );
         This function checks to see if the SCMD is done booting and is ready to receive commands. Use this
         after .begin(), and don't progress to your main program until this returns true.
         SCMD_STATUS_1: Read back basic program status
             B0: 1 = Enumeration Complete
             B1: 1 = Device busy
             B2: 1 = Remote read in progress
             B3: 1 = Remote write in progress
             B4: Read state of enable pin U2.5"
         
         else {
             for (let i = 0; i < 5; i += 1) {
                 pause(2000) // 2 s lange Wartezeit
                 pins.i2cWriteBuffer(i2cMotor, Buffer.fromArray([STATUS_1]), true)
 
                 if ((pins.i2cReadBuffer(i2cMotor, 1).getUint8(0) & 0x01) == 1) { // STATUS_1
                     n_MotorReady = true
                     break
                 }
             }
             return n_MotorReady
         }
     } */




    export function qMotorReset() { // aufgerufen beim Start

        n_MotorChipReady = [false, false, false, false]

        //addStatus(pins.i2cWriteBuffer(i2cMotorAB, Buffer.fromArray([ID])))

        //return i2cWriteBuffer(eMotor.ma, [ID])

        // Motor Chip AB
        if (!i2cWriteBuffer(eMotor.ma, [ID], true)) {
            addStatusHEX(i2cMotorAB) // Modul reagiert nicht
            return false
        } else if (i2cReadBuffer(eMotor.ma, 1)[0] == 0xA9) { // Reports hard-coded ID byte of 0xA9
            i2cWriteBuffer(eMotor.ma, [CONTROL_1, 1]) // Reset the processor now.
            // hier weiter zum nächsten Motor Chip
        } else {
            addStatusHEX(0x10 + i2cMotorAB)
            return false
        }

        // Motor Chip CD
        if (!i2cWriteBuffer(eMotor.mc, [ID], true)) {
            addStatusHEX(i2cMotorCD) // Modul reagiert nicht
            return false
        } else if (i2cReadBuffer(eMotor.mc, 1)[0] == 0xA9) { // Reports hard-coded ID byte of 0xA9
            return i2cWriteBuffer(eMotor.mc, [CONTROL_1, 1]) // Reset the processor now.
            // hier return true
        } else {
            addStatusHEX(0x10 + i2cMotorCD)
            return false
        }
    }


    function qMotorChipReady(pMotor: eMotor) { // fragt den I²C Status ab wenn false
        if (n_MotorChipReady[pMotor])
            return true
        else {
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
            //n_MotorChipReady[pMotor] = (i2cWriteBuffer(pMotor, [STATUS_1], true)
            //    && (i2cReadBuffer(pMotor, 1)[0] & 0x01) == 1) // STATUS_1

            i2cWriteBuffer(pMotor, [STATUS_1]) // kann I²C Bus Fehler haben
            n_MotorChipReady[pMotor] = (i2cReadBuffer(pMotor, 1)[0] & 0x01) == 1 // STATUS_1

            return n_MotorChipReady[pMotor]
        } // else
    }




    //% group="Motor"
    //% block="Motor %pMotor Power %pON" weight=3
    //% pON.shadow="toggleOnOff"
    export function qMotorPower(pMotor: eMotor, pON: boolean) { // sendet nur wenn der Wert sich ändert
        if (!qMotorChipReady(pMotor)) {
            // addStatusHEX(pMotor)
        } else if (pON !== n_MotorPower[pMotor]) { // !== XOR eine Seite ist true aber nicht beide
            n_MotorPower[pMotor] = pON
            i2cWriteBuffer(pMotor, [DRIVER_ENABLE, n_MotorPower[pMotor] ? 0x01 : 0x00])
        }
    }

    //% group="Motor"
    //% block="Motor %pMotor (1 ↓ 128 ↑ 255) %speed (128 ist STOP)" weight=2
    //% speed.min=0 speed.max=255 speed.defl=128
    export function qMotor255(pMotor: eMotor, speed: number) {
        if (qMotorChipReady(pMotor)) {
            if (n_MotorPower[pMotor] && radio.between(speed, 1, 255))
                n_MotorSpeed[pMotor] = speed
            else
                n_MotorSpeed[pMotor] = c_MotorStop

            qMotorWriteRegister(pMotor, n_MotorSpeed[pMotor])
        } else {
            //addStatusHEX(pMotor)
            //addStatusHEX(speed)
        }
    }

    function qMotorWriteRegister(pMotor: eMotor, speed: number) {
        if (speed == n_MotorSpeed[pMotor]) // sendet nur, wenn der Wert sich ändert
            return true
        else if (pMotor == eMotor.ma || pMotor == eMotor.mc)
            return i2cWriteBuffer(pMotor, [MA_DRIVE, speed])
        else if (pMotor == eMotor.mb || pMotor == eMotor.md)
            return i2cWriteBuffer(pMotor, [MB_DRIVE, speed])
        else
            return false

        /* switch (pMotor) {
            case eMotor.ma, eMotor.mc:
                return i2cWriteBuffer(pMotor, [MA_DRIVE, speed])
            case eMotor.mb, eMotor.md:
                return i2cWriteBuffer(pMotor, [MB_DRIVE, speed])
            default:
                return false
        } */
    }




    // ========== qwiicMotor: pins.i2cWriteBuffer pins.i2cReadBuffer

    function i2cWriteBuffer(pMotor: eMotor, bytes: number[], repeat = false) {

        if (pMotor == eMotor.ma || pMotor == eMotor.mb)
            return pins.i2cWriteBuffer(i2cMotorAB, Buffer.fromArray(bytes), repeat) == 0
        else if (pMotor == eMotor.mc || pMotor == eMotor.md)
            return pins.i2cWriteBuffer(i2cMotorCD, Buffer.fromArray(bytes), repeat) == 0
        else
            return false

        /*  switch (pMotor) {
             case eMotor.ma, eMotor.mb:{
                 return pins.i2cWriteBuffer(i2cMotorAB, Buffer.fromArray(bytes), repeat) == 0
                 break
             }
             case eMotor.mc, eMotor.md:
                 return pins.i2cWriteBuffer(i2cMotorCD, Buffer.fromArray(bytes), repeat) == 0
             default:
                 return true
         } */
    }

    function i2cReadBuffer(pMotor: eMotor, size: number): Buffer {
        if (pMotor == eMotor.ma || pMotor == eMotor.mb)
            return pins.i2cReadBuffer(i2cMotorAB, size)
        else if (pMotor == eMotor.mc || pMotor == eMotor.md)
            return pins.i2cReadBuffer(i2cMotorCD, size)
        else
            return Buffer.create(size)

        /* switch (pMotor) {
            case eMotor.ma, eMotor.mb:
                return pins.i2cReadBuffer(i2cMotorAB, size)
            case eMotor.mc, eMotor.md:
                return pins.i2cReadBuffer(i2cMotorCD, size)
            default:
                return Buffer.create(size)
        } */
    }



} // qwiicmotor.ts
