const fse = require('fs-extra')

const TYPES = ['empty', 'header', 'summary', 'error', 'record']
const KEYWORDS = {
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
// enum

module.exports = {
  file: '',
  path: '',
  raw_data: '',
  records: [],

  // returns handler object with data
  import: function(path) {
    this.file = path.split('/').pop()
    this.path = path
    this.raw_data = fse.readFileSync(path, 'utf8') || ''
    this.records = extract(this.raw_data)

    return this
  },

  // returns the name of the exported file
  // file exports to directory of imported file
  export: function() {
    let pathAry = this.path.split('/')
    let filename = pathAry.pop().split('.')[0] + '.csv'
    let saveFile = pathAry.join('/') + '/' + filename

    let parsedData = parse(this.records)

    fse.writeFile(saveFile, parsedData, function(err) {
      if(err) return console.log(err)
      console.log(`exported file saved to ${saveFile}`)
    });

    return filename
  }
}

function extract(raw) {
  let lines = raw.split('\n')
  let cnt = 0
  let records = []
  let raw_data = []

  for (const line of lines) {
    // create new record if empty line is found
    if (line.match(/^\s*$/)) {
      cnt++
      let rec = initRecord(cnt, raw_data)
      rec = buildRecord(rec)

      // push non-empty records to array
      if (rec) {
        if (rec.type !== 'empty') records.push(rec)
        console.log(rec)
      }

      // reset temp data holder
      raw_data = []
    }
    // add line to record if line is not empty
    else {
      raw_data.push(line)
    }
  }

  return records
}

// initializes record with id, type, and raw data
function initRecord(id, raw) {
  let type = TYPES[0] // empty

  // assign type to record
  for (let i = 0; i <= raw.length - 1; i++) {
    if (raw[i].charAt(0) === '@') type = TYPES[1] // header

    if (i === 0) {

      switch(raw[i].charAt(0)) {
        case '*':
          type = TYPES[2] // summary
          break
        case '~':
          type = TYPES[3] // global error
          break
        default: 
          type = TYPES[4] // record - reassign on build record
          break
      }
    }
  }

  let record = {
    id: id,
    type: type,
    raw: raw
  }

  return record
}

function buildRecord(rawRecord) {
  let cleanRecord
  
  switch(rawRecord.type) {
    case TYPES[0]:
      // skip empty records
      break

    case TYPES[1]:
      cleanRecord = handleHeader(rawRecord)
      break

    case TYPES[2]:
      cleanRecord = handleSummary(rawRecord)
      break

    case TYPES[3]:
      cleanRecord = handleError(rawRecord)
      break

    case TYPES[4]:
      cleanRecord = handleRecord(rawRecord)
      break

    default:
      console.log('ERROR in handler.buildRecord switch')
      break
  }

  return cleanRecord
}

function handleComment(s) {
  // NOTE may need the \r
  return s.replace(/\*/g, '')
  // return s.replace(/\*/g, '').replace(/\r/g, '')
}

function handleHeader(data) {
  let header = {
    id: data.id,
    intro: [],
    date: null,
    source: '',
    fileType: '',
    networkName: '',
    ncmName: ''
  }

  for (let line of data.raw) {

    // handle intro
    if (line.charAt(0) === '*') {
      header.intro.push(handleComment(line))
    }

    // TODO handle decompile date
    // TODO handle decompile source
    
    if (line.charAt(0) === '@') {
      // handle file type
      let dataAry = line.split(',')
      let temp = dataAry[0].split(' ')
      header.fileType = temp[0].replace(/@/g, '')
      // handle network name
      header.networkName = sanitize(temp[1])
      // handle ncmName
      header.ncmName = sanitize(dataAry[1])
    }
  }
  return header
}

function handleSummary(data) {
  let summary = {
    id: data.id,
    type: 'summary'
  }
  return summary
}

function handleError(data) {
  let error = {
    id: data.id,
    type: 'error'
  }
  return error
}

function handleRecord(data) {
  let recData = {
    keyword: '',
    type: '',
    network: '',
    id: data.id,
    name: '',
    description: '',
    subKeywords: [],
    comments: [],
    errors: []
  }

  for (let line of data.raw) {
    // handle comment
    if (line.charAt(0) === '*') {
      recData.comments.push(handleComment(line))
      continue
    }

    // handle error
    if (line.charAt(0) === '~') {
      let error = {

      }

      recData.errors.push(error)
      continue
    }

    // handle keyword
    if (line.charAt(0) !== ' ') {
      let dataAry = line.split(',')
      let temp = dataAry[0].split(' ')

      recData.keyword = temp[0]
      recData.type = searchKeywords(recData.keyword).type
      recData.network = sanitize(temp[1])
      recData.name = sanitize(dataAry[1])
      recData.description = sanitize(dataAry[2])
    }
    // handle subkeywords
    else {
      let dataArySub = line.trim().split(',')
      let tempSub

      if (dataArySub[0].length > 1) {
        tempSub = dataArySub[0].split(' ')
      }
      else {
        tempSub.push(' ')
      }
      

      let sub = {
        keyword: tempSub[0],
        params: []
      }
      dataArySub.shift()

      let param1 = tempSub[1]
      if (tempSub.length > 2) {
        tempSub.shift()
        param1 = tempSub.join(' ')
      }
      dataArySub.unshift(param1)
      
      for (let item of dataArySub) {
        sub.params.push(sanitize(item))
      }
      recData.subKeywords.push(sub)
    }
  }
  return recData
}

// cleans a string
function sanitize(s) {
  if (s) return s.replace(/\"/g, '').replace(/\r/g, '').trim()
  return ''
}

function searchKeywords(s) {
  for (let el of KEYWORDS.NC) {
    let keys = Object.keys(el)
    if (keys[0] === s) {
      return el
    }
  }
  return null
}

// converts file json data into .csv format
function parse(records) {
  return JSON.stringify(records)
}

// regex - everything in double quotes including quotes
// let params = data[i].match(/(["'])(?:\\.|[^\\])*?\1/g)
// for (param in params) {
//   let str = param.substr(1)
// }