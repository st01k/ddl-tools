
******************************************************************************
* Johnson Controls Inc. Metasys (TM) DDL Decompiler Release 12.00
* Copyright (C) 2001 Johnson Controls, Inc.   All Rights Reserved.
* Portions Copyright (C) 1987-1988 Lattice Inc.   All Rights Reserved.
*
* Mon May 07 07:00:54 2018
*
* archive decompiled from:
*      C:\Project\Bellatl\win.ini FMSDATA=C:\Project\Bellatl
*
******************************************************************************
@NC "BELLATL", "NC-16"


N2OPEN "NC-16HW", "1200_SB1", "N2 Type UNT Addr-31"
    ADDRESS 31, 1, 3, "UNT"
    GRAPHICS 0, 0
    REPORT N, N
*
* number of CS objects on this device: 1
*
*  AI slots used =    3,  4,  6
*  BI slots used =    1,  2,  3,  4
*  AO slots used =    2
*  BO slots used =    3
*  IF slots used =  129
*  II slots used =  
* IBy slots used =  197
* IBt slots used =  
*

N2OPEN "NC-16HW", "1200_SB2", "N2 Type UNT Addr-30"
    ADDRESS 30, 1, 3, "UNT"
    GRAPHICS 0, 0
    REPORT N, N
*
* number of CS objects on this device: 1
*
*  AI slots used =    1,  2,  3,  4
*  BI slots used =    1,  2,  3,  4
*  AO slots used =    1
*  BO slots used =    3
*  IF slots used =  129
*  II slots used =  
* IBy slots used =  197
* IBt slots used =  
*

N2OPEN "NC-16HW", "1200_B-1", "N2 Type UNT Addr-32"
    ADDRESS 32, 1, 3, "UNT"
    GRAPHICS 0, 0
    REPORT N, N
*
* number of CS objects on this device: 1
*
*  AI slots used =    3,  4,  6
*  BI slots used =    1,  2
*  AO slots used =    2
*  BO slots used =    3
*  IF slots used =  129
*  II slots used =  
* IBy slots used =  197
* IBt slots used =  
*

N2OPEN "NC-16HW", "1200_D56", "N2 Type UNT Addr-56"
    ADDRESS 56, 1, 3, "UNT"
    GRAPHICS 0, 0
    REPORT N, N
*
* number of CS objects on this device: 0
*
*  AI slots used =    1,  2,  3,  4,  5
*  BI slots used =    1,  2,  4
*  AO slots used =  
*  BO slots used =  
*  IF slots used =  
*  II slots used =  
* IBy slots used =  
* IBt slots used =  
*

N2OPEN "NC-16HW", "1200_D57", "N2 Type UNT Addr-57"
    ADDRESS 57, 1, 3, "UNT"
    GRAPHICS 0, 0
    REPORT N, N
*
* number of CS objects on this device: 0
*
*  AI slots used =    1,  2,  3,  4,  5,  6
*  BI slots used =    1
*  AO slots used =  
*  BO slots used =    1
*  IF slots used =  
*  II slots used =  
* IBy slots used =  
* IBt slots used =  
*

N2OPEN "NC-16HW", "1200_D58", "N2 Type UNT Addr-58"
    ADDRESS 58, 1, 3, "UNT"
    GRAPHICS 0, 0
    REPORT N, N
*
* number of CS objects on this device: 0
*
*  AI slots used =    1,  2
*  BI slots used =  
*  AO slots used =    1,  2
*  BO slots used =    1
*  IF slots used =  239,240,252
*  II slots used =  
* IBy slots used =  
* IBt slots used =  
*

DCDR "NC-16HW", "1200_D62", "N2 Type XTM105 Addr=62"
    ADDRESS 62, 1, 3, "XTM"
    GRAPHICS 0, 0
    REPORT N, N
*
* number of CS objects on this device: 0
*
* Hardware References used = 2DI5
*                            2DI3
*                            2DI4
*                            1DI1
*                            1DI3
*                            1DI2
*                            2DI1
*                            1DI4
*                            2DI8
*                            2DI6
*                            2DI7
*                            1DI5
*                            1DI7
*                            1DI6
*                            2DI2
*                            1DI8
*                            AI1
*                            AI2
*                            
*

DCDR "NC-16HW", "1200_D63", "N2 Type XTM105 Addr=63"
    ADDRESS 63, 1, 3, "XTM"
    GRAPHICS 0, 0
    REPORT N, N
*
* number of CS objects on this device: 0
*
* Hardware References used = 1DI3
*                            1DI1
*                            1DI2
*                            1DI4
*                            1DI6
*                            1DI5
*                            1DI8
*                            1DI7
*                            2DI1
*                            2DI2
*                            2DI3
*                            2DI4
*                            2DI5
*                            2DI6
*                            2DI7
*                            2DI8
*                            AI2
*                            AI3
*                            AI1
*                            AI5
*                            AI6
*                            
*

AI "1200_4-4", "VFD-VLTS", "VFD Motor Volts"
    HARDWARE "NC-16HW", "1200V4-4"
    GRAPHICS 0, 0
    N2OPENHW "AI", 8
    UNITS "Vac", 1
    ALARMSET , , , , , 1
    REPORT N, Y, N, N, , , 0, 0, 0, 0

AD "1200_4-4", "VFD-KW", "VFD KW"
    GRAPHICS 0, 0
    UNITS "KW", 1, 55.00000
    ALARMSET , , , , , 1, N
    REPORT N, Y, N, N, , , 0, 0, 0, 0

BI "1200_4-4", "FILTER", "Filter Status"
    HARDWARE "NC-16HW", "1200_4-4"
    GRAPHICS 0, 0
    N2OPENHW "BI", 2
    INIT N, 0, 30, N
    UNITS "Clean", "Dirty!"
    REPORT N, Y, N, N, , 0, 0, 5

JCB "1200_4-4", "KW-VFD"

CS "1200N8-1", "ALL-PNTS", "CS MODEL - Act Disc Stpt"
    MODEL "Ub100%1C"
~This Model not found in Model Database.
    HARDWARE "NC-16HW", "1200_8-1"
    GRAPHICS 0, 0
    REPORT N, N, 5
    DISPLAY "SP_2", "SP_2"
    FORMAT 1

JCB "1200N8-1", "Lag_Ctl"

CS "1200N8-2", "ALL-PNTS", "CS MODEL - Act Disc Stpt"
    MODEL "Ub100%1C"
~This Model not found in Model Database.
    HARDWARE "NC-16HW", "1200_8-2"
    GRAPHICS 0, 0
    REPORT N, N, 5
    DISPLAY "SP_2", "SP_2"
    FORMAT 1

AD "1200N8-2", "LAG-HL", "Lag Cycle Hi Ret Limit"
    GRAPHICS 0, 0
    UNITS "Deg F", 1, 78.00000
    ALARMSET , , , , , 1, N
    REPORT N, Y, N, N, 0, 0, 6, 3, 2, 5

AOS "1200N8-2", "DA-Sp", "Dis Stpt (for Clg Vlv)"
    HARDWARE "NC-16HW", "1200_8-2"
    GRAPHICS 0, 0
    N2OPENHW "ADF", 142, N
    INIT 55.00000, Y, Y
    UNITS "Deg F", 1
    REPORT N, Y, N, N, 0

AI "1200N8-2", "DA-TEMP", "Discharge Air Temp"
    HARDWARE "NC-16HW", "1200_8-2"
    GRAPHICS 0, 0
    N2OPENHW "AI", 3
    UNITS "Deg F", 1
    ALARMSET 2.000000, , , 45.00000, 85.00000, 1
    REPORT N, Y, N, N, 14, 14, 6, 3, 2, 5

AOS "1200N8-2", "CLGV-CMD", "Cooling Valve Command"
    HARDWARE "NC-16HW", "1200_8-2"
    GRAPHICS 0, 0
    N2OPENHW "AO", 2, Y
    INIT 0.0, N, N
    UNITS "%Open", 1
    REPORT N, Y, N, N, 5

AOS "1200N8-2", "RA-Sp", "Ret Stpt (for VFD)"
    HARDWARE "NC-16HW", "1200_8-2"
    GRAPHICS 0, 0
    N2OPENHW "ADF", 248, N
    INIT 75.00000, Y, Y
    UNITS "Deg F", 1
    REPORT N, Y, N, N, 0

BI "1200_6-4", "FILTER", "Filter Status"
    HARDWARE "NC-16HW", "1200_6-4"
    GRAPHICS 0, 0
    N2OPENHW "BI", 2
    INIT N, 0, 30, N
    UNITS "Clean", "Dirty"
    REPORT N, Y, N, N, , 0, 0, 5

BI "1200_6-4", "WTR-DET", "Water Detection Status"
    HARDWARE "NC-16HW", "1200_6-4"
    GRAPHICS 0, 0
    N2OPENHW "BI", 4
    INIT N, 1, 15, Y
    UNITS "Normal", "Alarm"
    REPORT N, Y, N, N, 6, 6, 2, 5

CS "1200_6-3", "ALL-PNTS", "CS MODEL - Act Disc Stpt"
    MODEL "Ub100%1C"
~This Model not found in Model Database.
    HARDWARE "NC-16HW", "1200_6-3"
    GRAPHICS 0, 0
    REPORT N, N, 5
    DISPLAY "SP_2", "SP_2"
    FORMAT 1

AI "1200N6-2", "VFD-AMPS", "VFD Moter Current"
    HARDWARE "NC-16HW", "1200V6-2"
    GRAPHICS 0, 0
    N2OPENHW "AI", 6
    UNITS "Amps", 1
    ALARMSET , , , , , 1
    REPORT N, Y, N, N, , , 0, 0, 0, 0

AI "1200N6-2", "VFD-VLTS", "VFD Motor Volts"
    HARDWARE "NC-16HW", "1200V6-2"
    GRAPHICS 0, 0
    N2OPENHW "AI", 8
    UNITS "Vac", 1
    ALARMSET , , , , , 1
    REPORT N, Y, N, N, , , 0, 0, 0, 0

AD "1200N6-2", "VFD-KW", "VFD KW"
    GRAPHICS 0, 0
    UNITS "KW", 1, 0.0
    ALARMSET , , , , , 1, N
    REPORT N, Y, N, N, , , 0, 0, 0, 0

BI "1200N6-2", "FILTER", "Filter Status"
    HARDWARE "NC-16HW", "1200_6-2"
    GRAPHICS 0, 0
    N2OPENHW "BI", 2
    INIT N, 0, 30, N
    UNITS "Clean", "Dirty"
    REPORT N, Y, N, N, , 0, 0, 5

JCB "1200N6-2", "KW-VFD"

CS "1200N6-1", "ALL-PNTS", "CS MODEL - Act Disc Stpt"
    MODEL "Ub100%1C"
~This Model not found in Model Database.
    HARDWARE "NC-16HW", "1200_6-1"
    GRAPHICS 0, 0
    REPORT N, N, 5
    DISPLAY "SP_2", "SP_2"
    FORMAT 1

BO "1200N6-1", "SHUTDOWN", "Shutdown Mode S/S"
    HARDWARE "NC-16HW", "1200_6-1"
    GRAPHICS 0, 0
    N2OPENHW "BD", 197, N
    UNITS "No", "Yes", N, Y, Y
    RESET Y
    TIMER 5, 1, 0, 255
    REPORT N, Y, N, N, , 0, 0, 0

BO "1200N6-1", "SAF-SS", "Supply Fan S/S"
    HARDWARE "NC-16HW", "1200_6-1"
    GRAPHICS 0, 0
    N2OPENHW "BO", 3, Y
    UNITS "Off", "On", N, Y, N
    RESET Y
    TIMER
    FEEDBACK "1200N6-1", "SAF-STS", Y
    REPORT N, Y, N, N, 3, 6, 2, 5

BI "1200N6-1", "SAF-STS", "Supply Fan Status"
    HARDWARE "NC-16HW", "1200_6-1"
    GRAPHICS 0, 0
    N2OPENHW "BI", 1
    INIT N, 2, 120, N
    UNITS "Off", "On"
    REPORT N, Y, N, N, , 0, 0, 5

BI "1200_8-7", "CRAC7-S", "CRAC-7 Status"
    HARDWARE "NC-16HW", "1200_8-8"
    GRAPHICS 0, 0
    N2OPENHW "BI", 3
    INIT N, 0, 120, N
    UNITS "Off", "On"
    REPORT N, Y, N, N, , 0, 0, 5

BI "1200_8-7", "CRAC7-A", "CRAC-7 Alarm Status"
    HARDWARE "NC-16HW", "1200_8-8"
    GRAPHICS 0, 0
    N2OPENHW "BI", 1
    INIT N, 1, 30, Y
    UNITS "Normal", "Alarm"
    REPORT N, Y, N, N, 0, 6, 2, 5

BD "1200_8-7", "CRAC7OfN", "CRAC-7 Off Normal Alarm"
    GRAPHICS 0, 0
    UNITS "No", "Yes!!!"
    INIT N, N, 1, 30, N, N
    REPORT N, Y, N, N, 11, 6, 2, 5

BD "1200_8-7", "CRAC7-HT", "CRAC-7 High Temperature"
    ASSOCINP "CS", "NC-16HW", "CRAC-Pts", "BD_3"
    GRAPHICS 0, 0
    UNITS "No", "Yes!!!"
    INIT N, N, 1, 30, N, N
    REPORT N, Y, N, N, 12, 6, 2, 5

~ERROR - 1200_8-7\CRAC7HiT is listed in the object entry database file as a BD
         object. This object cannot be found in the database file containing
          all data for all objects of type BD.
         (The object entry data base file contains a list of all of an
         NC's system\object names and their object type.)


AI "1200_8-7", "Z1-Temp", "Zone-1 Temperature"
    HARDWARE "NC-16HW", "1200_8-8"
    GRAPHICS 0, 0
    N2OPENHW "AI", 1
    UNITS "Deg F", 1
    ALARMSET 1.000000, , , 65.00000, 85.00000, 1
    REPORT N, Y, N, N, 1, 1, 6, 3, 2, 5

AI "1200_8-7", "Z2-Temp", "Zone-2 Temperature"
    HARDWARE "NC-16HW", "1200_8-8"
    GRAPHICS 0, 0
    N2OPENHW "AI", 2
    UNITS "Deg F", 1
    ALARMSET 1.000000, , , 65.00000, 85.00000, 1
    REPORT N, Y, N, N, 1, 1, 6, 3, 2, 5

AI "1200_8-7", "Z3-Temp", "Zone-3 Temperature"
    HARDWARE "NC-16HW", "1200_8-8"
    GRAPHICS 0, 0
    N2OPENHW "AI", 3
    UNITS "Deg F", 1
    ALARMSET 1.000000, , , 65.00000, 85.00000, 1
    REPORT N, Y, N, N, 1, 1, 6, 3, 2, 5

BI "1200_8-7", "Wtr-Det", "Under Flr Wtr Detect 7&8"
    HARDWARE "NC-16HW", "1200_8-8"
    GRAPHICS 0, 0
    N2OPENHW "BI", 5
    INIT N, 1, 15, Y
    UNITS "Normal", "Alarm"
    REPORT N, Y, N, N, 6, 6, 2, 5

BD "1200_8-7", "--------", "Rotate Info - Don't Adj"
    GRAPHICS 0, 0
    UNITS "------", "-----"
    INIT N, N, 0, 30, N, N
    REPORT N, N, , N, , 0, 0, 0

BD "1200_8-7", "Rotate-C", "CRAC-7&8 Rotate Command"
    GRAPHICS 0, 0
    UNITS "Off", "Rotate"
    INIT N, N, 0, 30, N, N
    REPORT N, Y, N, N, , 0, 0, 0

BD "1200_8-7", "Rotate-S", "CRAC-7&8 Rotate Status"
    ASSOCINP "CS", "NC-16HW", "CRAC-Pts", "BD_2"
    GRAPHICS 0, 0
    UNITS "Off", "Rotate"
    INIT N, N, 0, 30, N, N
    REPORT N, Y, N, N, , 0, 0, 0

AOS "1200_8-7", "Rot-Sts", "Rotation Status"
    HARDWARE "NC-16HW", "1200_8-8"
    GRAPHICS 0, 0
    N2OPENHW "ADI", 46, Y
    INIT 0.0, Y, N
    UNITS "Number", 0
    REPORT N, Y, N, N, 0

AOS "1200_8-7", "CRAC7Out", "CRAC-7 Output"
    HARDWARE "NC-16HW", "1200_8-8"
    GRAPHICS 0, 0
    N2OPENHW "ADI", 44, Y
    INIT 0.0, Y, N
    UNITS "Number", 0
    REPORT N, Y, N, N, 0

AOS "1200_8-7", "CRAC8Out", "CRAC-8 Output"
    HARDWARE "NC-16HW", "1200_8-8"
    GRAPHICS 0, 0
    N2OPENHW "ADI", 45, Y
    INIT 0.0, Y, N
    UNITS "Number", 0
    REPORT N, Y, N, N, 0

AOS "1200_8-7", "CRAC7-AF", "CRAC-7 Air Flow Failure"
    HARDWARE "NC-16HW", "1200_8-8"
    GRAPHICS 0, 0
    N2OPENHW "ADI", 40, Y
    INIT 0.0, Y, N
    UNITS "Number", 0
    REPORT N, Y, N, N, 0

~ERROR - 1200_8-7\CRAC8-AF is listed in the object entry database file as a AOS
         object. This object cannot be found in the database file containing
          all data for all objects of type AOS.
         (The object entry data base file contains a list of all of an
         NC's system\object names and their object type.)

JCB "1200-MIS", "LL_CTRL"

JCB "1200-MIS", "FMS_RST"

JCB "1200-MIS", "OAT_DUP"

JCB "1200-MIS", "OAD_LOUT"

JCB "1200-MIS", "EME_SHDN"

BI "1200_GEN", "FOLeak-S", "Fuel Oil Leak Sens South"
    HARDWARE "NC-16HW", "1200_D67"
    GRAPHICS 0, 0
    N2OPENHW "BI", 2
    INIT N, 0, 30, N
    UNITS "Normal", "Alarm"
    REPORT N, Y, N, N, , 0, 0, 5

BD "1200_GEN", "ROP1-STS", "Return Oil Pump-1 Status"
    GRAPHICS 0, 0
    UNITS "Off", "On"
    INIT N, N, 0, 30, N, N
    REPORT N, Y, N, N, , 0, 0, 5

BD "1200_GEN", "ROP2-STS", "Return Oil Pump-2 Status"
    GRAPHICS 0, 0
    UNITS "Off", "On"
    INIT N, N, 0, 30, N, N
    REPORT N, Y, N, N, , 0, 0, 5

BD "1200_9FL", "--------", "Bsmt Fuel Oil Pump Room"
    GRAPHICS 0, 0
    UNITS "------", "-----"
    INIT N, N, 0, 30, N, N
    REPORT N, N, , N, , 0, 0, 0

BO "1200_9FL", "SF1-SS", "Supply Fan-1 S/S"
    HARDWARE "NC-16HW", "1200_9-4"
    GRAPHICS 0, 0
    N2OPENHW "BO", 4, N
    UNITS "Off", "On", Y, Y, Y
    RESET Y
    TIMER 5, 1, 0, 255
    FEEDBACK "1200_9FL", "SF1-STS", Y
    REPORT N, Y, N, N, , 0, 0, 5

BD "1200_8-4", "HI-TEMP", "Unit High Temp"
    GRAPHICS 0, 0
    UNITS "No", "Yes"
    INIT N, N, 1, 0, N, N
    REPORT N, Y, N, N, , 0, 0, 5

AD "1200_8-4", "LEAD-HLS", "Lead High Limit For Sby"
    GRAPHICS 0, 0
    UNITS "Deg F", 1, 83.00000
    ALARMSET , , , , , 1, N
    REPORT N, Y, N, N, 0, 0, 6, 4, 3, 5

AD "1200_8-4", "Z-TEMP", "Zone Temperature"
    ASSOCINP "AI", "1200_8-3", "Z-TEMP", "VALUE"
    GRAPHICS 0, 0
    UNITS "Deg F", 1, 77.70000
    ALARMSET , , , , , 1, N
    REPORT N, Y, N, N, 31, 31, 6, 3, 2, 5

BI "1200_8-4", "WTR-DET", "Water Detector Status"
    HARDWARE "NC-16HW", "1200_8-4"
    GRAPHICS 0, 0
    N2OPENHW "BI", 3
    INIT N, 1, 15, Y
    UNITS "Normal", "Alarm"
    REPORT N, Y, N, N, 6, 6, 2, 5

JCB "1200_8-4", "HI_TEMP"

JCB "1200_8-4", "OFF_NORM"

JCB "1200_8-4", "SAF_SS"

******************************************************************************
*
*                      SUMMARY FOR BELLATL NC-16
*
*                            HARDWARE OBJECTS
*
*        D600s   0          DCDRs   2           DCMs   0        DCM140s   0   
*         DSCs   0       DSC8500s   0          FIREs   0           FPUs   0   
*         LCDs   0           LONs   0        N2OPENs  55            XMs   0   
*
*  Total Hardware Objects = 57
*
*
*                            SOFTWARE OBJECTS
*
*        ACMs   0            ADs  33**          AIs 165           AODs   0   
*        AOSs 124**          BDs  44**          BIs 170            BOs  74   
*      C210As   0         C260As   0         C260Xs   0         C500Xs   0   
*         CSs  31**        DLLRs   0           JCBs  63           LCGs   0   
*         MCs   0           MSDs   0           MSIs   0           MSOs   0   
*       PIDLs   0        READERs   0          ZONEs   0   
*
*  Total Software Objects = 704
*
*  Total Objects = 761 ** object counts followed by ** signify
*                        object types which had errors
*
*
*                                FEATURES 
*
*       CARDs   0      TIMEZONEs   0   
*
*  Total Features = 0
*
******************************************************************************
* 12 errors decompiling - Decompiled source has errors that will not compile
******************************************************************************
