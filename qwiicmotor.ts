
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

    enum eMotorChip { ab, cd }

    function chip(pMotor: eMotor): eMotorChip {
        if (pMotor == eMotor.ma || pMotor == eMotor.mb)
            return eMotorChip.ab // 0
        else
            return eMotorChip.cd // 1
    }

    function led(pMotorChip: eMotorChip): eRGBled {
        if (pMotorChip == eMotorChip.ab) //(pMotor == eMotor.ma || pMotor == eMotor.mb)
            return eRGBled.b // 1
        else
            return eRGBled.c // 2
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
    // let n_MotorABReady = false
    // let n_MotorCDReady = false
    let n_MotorChipPower = [false, false]
    // let n_MotorABPower = false
    // let n_MotorCDPower = false
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
        //   n_MotorABReady = false
        //   n_MotorCDReady = false

        //addStatus(pins.i2cWriteBuffer(i2cMotorAB, Buffer.fromArray([ID])))
        //return i2cWriteBuffer(eMotor.ma, [ID])

        //pause(2000)

        control.waitMicros(2000000) // 2 s lange Wartezeit

        let a = qMotorChipReset(i2cMotorAB, eMotorChip.ab)

        control.waitMicros(200)

        let c = qMotorChipReset(i2cMotorCD, eMotorChip.cd)

        return a && c
        /* 
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
                } */
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

        //  let l: eRGBled = isAB(pMotor) ? eRGBled.b : eRGBled.c

        // if (isAB(pMotor)) {
        // Motor AB
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

        // } 
        /* else {
            // Motor CD
            if (n_MotorCDReady)
                return true
            else {
                if (!i2cWriteBuffer(pMotor, [STATUS_1]))  // kann I²C Bus Fehler haben
                    rgbLEDon(eRGBled.c, Colors.Violet, true)

                if ((i2cReadBuffer(pMotor, 1)[0] & 0x01) == 1) {
                    rgbLEDon(eRGBled.c, Colors.Off, true)
                    n_MotorCDReady = true
                    // n_MotorChipReady[pMotor] = true
                }
                return n_MotorCDReady
            }
        } */



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



        /* if (n_MotorChipReady[pMotor])
            return true
        else { */

        /* for (let i = 0; i < 5; i += 1) {
            // Wartezeit 2 s in getStatus-ready
            pause(2000) // 2 s lange Wartezeit
            i2cWriteBuffer(pMotor, [STATUS_1], true)


            if ((i2cReadBuffer(pMotor, 1)[0] & 0x01) == 1) { // STATUS_1
                n_MotorChipReady[pMotor] = true
                break
            }
        } */



        //n_MotorChipReady[pMotor] = (i2cWriteBuffer(pMotor, [STATUS_1], true)
        //    && (i2cReadBuffer(pMotor, 1)[0] & 0x01) == 1) // STATUS_1
        // pause(2000) // 2 s lange Wartezeit

        /* if (!i2cWriteBuffer(pMotor, [STATUS_1])) {// kann I²C Bus Fehler haben
            rgbLEDon(l, Colors.Violet, true)
        }

        if ((i2cReadBuffer(pMotor, 1)[0] & 0x01) == 1) {
            rgbLEDon(l, Colors.Off, true)
            n_MotorChipReady[pMotor] = true
        }
       
        return n_MotorChipReady[pMotor] */
    }





    //% group="Motor"
    //% block="Motor %pMotor Power %pON" weight=3
    //% pON.shadow="toggleOnOff"
    export function qMotorPower(pMotor: eMotor, pON: boolean) { // sendet nur wenn der Wert sich ändert
        /*   if (isAB(pMotor)) {
              // Motor AB
              if (!qMotorChipReady(pMotor) && pON !== n_MotorABPower) {
                  n_MotorABPower = pON
                  if (!i2cWriteBuffer(pMotor, [DRIVER_ENABLE, n_MotorABPower ? 0x01 : 0x00])) {
                      rgbLEDon(eRGBled.b, Colors.Purple, true) // Fehler
                  } else {
                      rgbLEDon(eRGBled.b, n_MotorABPower ? Colors.Blue : 64, true) // kein Fehler blau Helligkeit dunkler bei Motor OFF
                  }
              }
          } else {
  
              // Motor CD
              if (!qMotorChipReady(pMotor) && pON !== n_MotorCDPower) {
                  n_MotorCDPower = pON
                  if (!i2cWriteBuffer(pMotor, [DRIVER_ENABLE, n_MotorCDPower ? 0x01 : 0x00])) {
                      rgbLEDon(eRGBled.c, Colors.Purple, true) // Fehler
                  } else {
                      rgbLEDon(eRGBled.c, n_MotorCDPower ? Colors.Blue : 64, true) // kein Fehler blau Helligkeit dunkler bei Motor OFF
                  }
              }
          }
   */


        if (!qMotorChipReady(chip(pMotor))) {
            // addStatusHEX(pMotor)
        } else if (pON !== n_MotorChipPower[chip(pMotor)]) { // !== XOR eine Seite ist true aber nicht beide
            //  let l: eRGBled = (isAB(pMotor) ? eRGBled.b : eRGBled.c)
            n_MotorChipPower[chip(pMotor)] = pON
            if (!i2cWriteBuffer(chip(pMotor), [DRIVER_ENABLE, n_MotorChipPower[chip(pMotor)] ? 0x01 : 0x00])) {
                rgbLEDon(led(chip(pMotor)), Colors.Purple, true) // Fehler
            } else {
                rgbLEDon(led(chip(pMotor)), n_MotorChipPower[chip(pMotor)] ? Colors.Blue : 64, true) // kein Fehler blau Helligkeit dunkler bei Motor OFF
            }
        }
    }

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
                        rgbLEDon(isAB(pMotor) ? eRGBled.b : eRGBled.c, Colors.White, true)
                }
            }

        }
        else
            qMotor255(pMotor, c_MotorStop)
        // n_MotorSpeed[pMotor] = c_MotorStop



    }
    /* 
        function qMotorWriteRegister(pMotor: eMotor, speed: number) {
          
            if (qMotorChipReady(pMotor) && n_MotorPower[pMotor])
    
    
                if (pMotor == eMotor.ma || pMotor == eMotor.mc)
                    i2cWriteBuffer(pMotor, [MA_DRIVE, speed])
                else if (pMotor == eMotor.mb || pMotor == eMotor.md)
                    i2cWriteBuffer(pMotor, [MB_DRIVE, speed])
          
    
        } */




    // ========== qwiicMotor: pins.i2cWriteBuffer pins.i2cReadBuffer

    function isAB(pMotor: eMotor) {
        return (pMotor == eMotor.ma || pMotor == eMotor.mb)
    }

    function i2cWriteBuffer(pMotorChip: eMotorChip, bytes: number[], repeat = false) {

        return pins.i2cWriteBuffer(pMotorChip == eMotorChip.cd ? i2cMotorCD : i2cMotorAB, Buffer.fromArray(bytes), repeat) == 0
        /* 
                if (pMotor == eMotor.ma || pMotor == eMotor.mb)
                    return pins.i2cWriteBuffer(i2cMotorAB, Buffer.fromArray(bytes), repeat) == 0
                else if (pMotor == eMotor.mc || pMotor == eMotor.md)
                    return pins.i2cWriteBuffer(i2cMotorCD, Buffer.fromArray(bytes), repeat) == 0
                else
                    return false
         */
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

    function i2cReadBuffer(pMotorChip: eMotorChip, size: number): Buffer {

        return pins.i2cReadBuffer(pMotorChip == eMotorChip.cd ? i2cMotorCD : i2cMotorAB, size)
/* 
        if (pMotor == eMotor.ma || pMotor == eMotor.mb)
            return pins.i2cReadBuffer(i2cMotorAB, size)
        else if (pMotor == eMotor.mc || pMotor == eMotor.md)
            return pins.i2cReadBuffer(i2cMotorCD, size)
        else
            return Buffer.create(size)
 */
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
