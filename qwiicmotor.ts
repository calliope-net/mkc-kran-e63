
namespace kran_e { // qwiicmotor.ts

    // I²C Adresse Motor Modul
    const i2cMotorAB = 0x5D
    const i2cMotorCD = 0x5E

    export enum eMotor {
        //% block="A"
        ma = 0,
        //% block="B"
        mb = 1,
        //% block="C"
        mc = 2,
        //% block="D"
        md = 3,
    }

    export enum eMotorChip {
        //% block="A B"
        ab,
        //% block="C D"
        cd
    }

    function chip(pMotor: eMotor): eMotorChip {
        if (pMotor == eMotor.mc || pMotor == eMotor.md)
            return eMotorChip.cd // 1
        else
            return eMotorChip.ab // 0
    }

    function led(pMotorChip: eMotorChip): eRGBled {
        if (pMotorChip == eMotorChip.cd)
            return eRGBled.c // 2
        else
            return eRGBled.b // 1
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
    let n_MotorChipReady = [false, false]
    let n_MotorChipPower = [false, false]
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

        n_MotorChipReady = [false, false]

        control.waitMicros(2000000) // 2 s lange Wartezeit

        let a = qMotorChipReset(i2cMotorAB, eMotorChip.ab)

        control.waitMicros(200)

        let c = qMotorChipReset(i2cMotorCD, eMotorChip.cd)

        return a && c
    }


    function qMotorChipReset(i2c: number, pMotorChip: eMotorChip) {
        rgbLEDon(led(pMotorChip), Colors.Red, true)

        if (!i2cWriteBuffer(pMotorChip, [ID], true)) {
            basic.showString(Buffer.fromArray([i2c]).toHex())
            //addStatusHEX(i2cMotorAB) // Modul reagiert nicht
            return false
        }

        rgbLEDon(led(pMotorChip), Colors.Orange, true)

        if (!(i2cReadBuffer(pMotorChip, 1)[0] == 0xA9)) { // Reports hard-coded ID byte of 0xA9
            return false
        }

        rgbLEDon(led(pMotorChip), Colors.Yellow, true)

        if (!i2cWriteBuffer(pMotorChip, [CONTROL_1, 1])) { // Reset the processor now.
            return false
        }

        rgbLEDon(led(pMotorChip), Colors.Green, true)

        return true
    }



    function qMotorChipReady(pMotorChip: eMotorChip) { // fragt den I²C Status ab wenn false

        if (n_MotorChipReady[pMotorChip])
            return true
        else {
            if (!i2cWriteBuffer(pMotorChip, [STATUS_1]))  // kann I²C Bus Fehler haben
                rgbLEDon(led(pMotorChip), Colors.Violet, true)

            if ((i2cReadBuffer(pMotorChip, 1)[0] & 0x01) == 1) {
                rgbLEDon(led(pMotorChip), Colors.Off, true)
                n_MotorChipReady[pMotorChip] = true
                // n_MotorChipReady[pMotor] = true
            }
            return n_MotorChipReady[pMotorChip]
        }
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
    }

    //% group="Motor"
    //% block="Motor Chip %pMotorChip Power %pON" weight=3
    //% pON.shadow="toggleOnOff"
    export function qMotorChipPower(pMotorChip: eMotorChip, pON: boolean) {
        if (qMotorChipReady(pMotorChip) && pON !== n_MotorChipPower[pMotorChip]) {
            n_MotorChipPower[pMotorChip] = pON
            if (!i2cWriteBuffer(pMotorChip, [DRIVER_ENABLE, n_MotorChipPower[pMotorChip] ? 0x01 : 0x00])) {
                rgbLEDon(led(pMotorChip), Colors.Purple, true) // Fehler
            } else {
                rgbLEDon(led(pMotorChip), n_MotorChipPower[pMotorChip] ? Colors.Blue : 64, true) // kein Fehler blau Helligkeit dunkler bei Motor OFF
            }
        }
    }

    // group="Motor"
    // block="Motor %pMotor Power %pON" weight=3
    // pON.shadow="toggleOnOff"
    /* export function qMotorPower(pMotor: eMotor, pON: boolean) { // sendet nur wenn der Wert sich ändert

        if (!qMotorChipReady(chip(pMotor))) {
            // addStatusHEX(pMotor)
        } else if (pON !== n_MotorChipPower[chip(pMotor)]) { // !== XOR eine Seite ist true aber nicht beide

            n_MotorChipPower[chip(pMotor)] = pON
            if (!i2cWriteBuffer(chip(pMotor), [DRIVER_ENABLE, n_MotorChipPower[chip(pMotor)] ? 0x01 : 0x00])) {
                rgbLEDon(led(chip(pMotor)), Colors.Purple, true) // Fehler
            } else {
                rgbLEDon(led(chip(pMotor)), n_MotorChipPower[chip(pMotor)] ? Colors.Blue : 64, true) // kein Fehler blau Helligkeit dunkler bei Motor OFF
            }
        }
    } */

    //% group="Motor"
    //% block="Motor %pMotor (1 ↓ 128 ↑ 255) %speed (128 ist STOP)" weight=2
    //% speed.min=0 speed.max=255 speed.defl=128
    export function qMotor255(pMotor: eMotor, speed: number) {
        let e = false
        // addStatusHEX(speed)
        if (radio.between(speed, 1, 255)) {
            if (speed != n_MotorSpeed[pMotor]) { // sendet nur, wenn der Wert sich ändert
                n_MotorSpeed[pMotor] = speed
                //qMotorWriteRegister(pMotor, n_MotorSpeed[pMotor])

                if (qMotorChipReady(chip(pMotor)) && n_MotorChipPower[chip(pMotor)]) {

                    if (pMotor == eMotor.ma || pMotor == eMotor.mc)
                        e = i2cWriteBuffer(chip(pMotor), [MA_DRIVE, speed])
                    else if (pMotor == eMotor.mb || pMotor == eMotor.md)
                        e = i2cWriteBuffer(chip(pMotor), [MB_DRIVE, speed])

                    if (!e)
                        rgbLEDon(led(chip(pMotor)), Colors.White, true)
                }
            }

        }
        else
            qMotor255(pMotor, c_MotorStop)
    }




    // ========== qwiicMotor: pins.i2cWriteBuffer pins.i2cReadBuffer



    function i2cWriteBuffer(pMotorChip: eMotorChip, bytes: number[], repeat = false) {
        return pins.i2cWriteBuffer(pMotorChip == eMotorChip.cd ? i2cMotorCD : i2cMotorAB, Buffer.fromArray(bytes), repeat) == 0
    }

    function i2cReadBuffer(pMotorChip: eMotorChip, size: number): Buffer {
        return pins.i2cReadBuffer(pMotorChip == eMotorChip.cd ? i2cMotorCD : i2cMotorAB, size)
    }



} // qwiicmotor.ts
