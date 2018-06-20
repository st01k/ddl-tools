const fse = require('fs-extra')
const ddlConsts = require('./ddl-constants')

let TYPES = ddlConsts.TYPES
let KEYWORDS = ddlConsts.KEYWORDS

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

    return saveFile
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

      if (rec) {
        // push error to previous record's errors
        if (rec.type === 'error') {
          let prevRecord = records.pop()
          prevRecord.errors.push(rec)
          records.push(prevRecord)
        }
  
        // push non-empty records to array
        else if (rec.type !== 'empty') {
          prevRecord = rec
          records.push(rec)
        }
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

  let record = {
    id: id,
    type: type,
    raw: raw
  }

  // assign type to record
  for (let i = 0; i <= raw.length - 1; i++) {
    if (i === 0) {

      switch(raw[i].charAt(0)) {
        case '*':
          record.type = TYPES[2] // summary
          break
        case '~':
          record.type = TYPES[3] // semantic error
          break
        default: 
          record.type = TYPES[4] // record - reassign specific on build record
          break
      }
    }
    else if (raw[i].charAt(0) === '@') {
      record.type = TYPES[1] // header
    }
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
      cleanRecord = handleError(rawRecord, '')
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
    type: TYPES[1],
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
      // extract file info
      let dataAry = line.split(',')
      let temp = dataAry[0].split(' ')
      header.fileType = temp[0].replace(/@/g, '')
      header.networkName = sanitize(temp[1])
      header.ncmName = sanitize(dataAry[1])
    }
  }
  return header
}

function handleSummary(data) {
  let summary = {
    id: data.id,
    type: TYPES[2]
  }
  return summary
}

function handleError(data, subkeyword) {
  let error = {
    type: TYPES[3],
    msg: '',
    subkeyword: subkeyword
  }

  if (subkeyword === '') {
    // semantic error
    let s = ''
    for (let item of data.raw) {
      s += `${sanitize(item)}\n`
    }
    error.msg = s
  }
  else {
    // syntax error
    error.msg = data
  }
  
  return error
}

function handleRecord(data) {
  let recData = {
    keyword: '',
    type: TYPES[4],
    network: '',
    id: data.id,
    name: '',
    description: '',
    subKeywords: [],
    comments: [],
    errors: []
  }

  let prevSubkeyword
  for (let line of data.raw) {
    // handle comment
    if (line.charAt(0) === '*') {
      recData.comments.push(handleComment(line))
      continue
    }

    // handle syntax error
    if (line.charAt(0) === '~') {
      let error = handleError(line, prevSubkeyword)
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
      prevSubkeyword = sub.keyword
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