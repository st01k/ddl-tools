const fse = require('fs-extra')

const TYPES = ['empty', 'header', 'summary', 'error', 'record']
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
      let builtRec = buildRecord(rec)

      // push non-empty records to array
      if (rec) {
        if (rec.type !== 'empty') records.push(rec)
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
    raw: raw,
    data: {}
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
  // console.log('handling comment')

  // NOTE may need the \r
  return s.replace(/\*/g, '').replace(/\r/g, '')
}

function handleHeader(data) {
  console.log('handling header')

  let header = {
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
  // console.log('handling summary')
}

function handleError(data) {
  // console.log('handling error')
}

function handleRecord(data) {
  // console.log('handling record')

  const recordTypes = ['device', 'point', 'program']

  let recData = {
    keyword: '',
    network: '',
    id: '',
    description: '',
    subKeywords: [],
    comments: [],
    errors: []
  }

  for (let line of data.raw) {
    console.log(line)

    // handle comment
    if (line.charAt(0) === '*') {
      recData.comments.push(handleComment(line))
      continue
    }

    // handle error
    if (line.charAt(0) === '~') {
      
      continue
    }
    
    let dataAry = line.split(',')
    let temp = dataAry[0].split(' ')

    // handle keyword
    if (line.charAt(0) !== ' ') {
      recData.keyword = temp[0].replace(/@/g, '')
      recData.network = sanitize(temp[1])
      recData.id = sanitize(dataAry[1])
      recData.description = sanitize(dataAry[2])
    }
    // handle subkeywords
    else {
      let sub = {

      }

      recData.subKeywords.push(sub)
    }
  }
  console.log(recData)
  return recData
}

// cleans a string
function sanitize(s) {
  if (s) return s.replace(/\"/g, '').replace(/\r/g, '').trim()
  return ''
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