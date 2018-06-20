module.exports = {
  TYPES: ['empty', 'header', 'summary', 'error', 'record'],
  KEYWORDS: {
    NET: [
      {NET: 'Defines a network accessible from this Operator Workstation and adds its name to the network map.'},
      {PORT: 'Configures one of the ports on this Operator Workstation.'}
    ],
    GLOBAL: [
      {DEFDES: 'Default device'},
      {GRP: 'PC group and its parent'},
      {NC: 'Defines an NCM'},
      {PC: 'Operator Workstation, either N1-direct, NC-dial, or NC-direct'},
      {PTR: 'Printer, either PC-direct, NC-direct, or NC-dial'},
      {RPT: 'COS (Change-of-State) report group and its targets'},
      {SYS: 'System name and optionally assigns it to a PC group'}
    ],
    MODEL: [
      {CSMODEL: 'Defines a software model.'}
    ],
    NC: [
      {ACM: 'Accumulator', type: 'software'},
      {AD: 'Analog Data', type: 'software'},
      {AI: 'Analog Input', type: 'software'},
      {AOD: 'Analog Output Digital', type: 'software'},
      {AOS: 'Analog Output Setpoint', type: 'software'},
      {BD: 'Binary Data', type: 'software'},
      {BI: 'Binary Input', type: 'software'},
      {BO: 'Binary Output', type: 'software'},
      {C210A: 'Control System for a C210A controller', type: 'software'},
      {C260A: 'Control System for a C260A controller', type: 'software'},
      {C260X: 'Control System for a C260X controller', type: 'software'},
      {C500X: 'Control System for a C500X controller', type: 'software'},
      {CARD: 'CARD Access', type: 'feature'},
      {CS: 'Generic Control System', type: 'software'},
      {D600: 'D600 controller', type: 'hardware'},
      {DCDR: 'LCP, DX9100, DX91ECH, DC9100, DR9100, TC9100, XT9100, or XTM', type: 'hardware'},
      {DCM: 'DCM controller', type: 'hardware'},
      {DCM140: 'DCM140 controller', type: 'hardware'},
      {DELSLAVE: 'Deletes a slave from an MCO', type: 'auxilliary'},
      {DELCARD: 'Deletes the CARD Access feature', type: 'auxilliary'},
      {DELETE: 'Allows the deletion of an object', type: 'auxilliary'},
      {DELTZ: 'Deletes the TIMEZONE Access feature', type: 'auxilliary'},
      {DLLR: 'Local Group Object', type: 'software'},
      {DSC: 'C210A or C260A', type: 'hardware'},
      {DSC8500: 'DSC8500 controller', type: 'hardware'},
      {FIRE: 'FIRE controller', type: 'hardware'},
      {FPU: 'FPU controller', type: 'hardware'},
      {JCB: 'Adds a process name only (use GPL or JC-BASIC to create the process object.', type: 'software'},
      {LCD: 'lighting controller', type: 'hardware'},
      {LCG: 'Lighting Controller Group', type: 'software'},
      {LON: 'LON device (LONTCU)', type: 'hardware'},
      {MC: 'Multiple Command', type: 'software'},
      {MSD: 'Multistate Data', type: 'software'},
      {MSI: 'Multistate Input', type: 'software'},
      {MSO: 'Multistate Output', type: 'software'},
      {N2OPEN: 'AHU, MIG, NDM, PHX, UNT, VAV, VMA, or VND controller', type: 'hardware'},
      {PIDL: 'PID Loop for a DCM', type: 'software'},
      {READER: 'READER for a D600', type: 'software'},
      {SLAVE: 'Slave for the MC', type: 'auxilliary'},
      {TIMEZONE: 'TIMEZONE Access', type: 'feature'},
      {XM: 'Point multiplex module', type: 'hardware'},
      {ZONE: 'ZONE for a FIRE controller', type: 'software'}
    ]
  }
// const SUBKEYWORDS = {
//   pointtype,
//   pointstr,
//   hardware,
//   graphics,
//   n2openhw,
//   units,
//   alarmset,
//   report,
//   init,
//   reset,
//   timer,
//   model,
//   display,
//   format,
//   feedback,
//   address,
//   associnp
// }
}