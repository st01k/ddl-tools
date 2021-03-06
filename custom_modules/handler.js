const electron = require('electron')

const fse = require('fs-extra')
const ddlConsts = require('./ddl-constants')

let TYPES = ddlConsts.TYPES

module.exports = {
  file: '',
  path: '',
  raw_data: '',
  records: [],
  keywords: [],


  // returns handler object with data
  import: function(path) {
    this.file = path.split('/').pop()
    this.path = path
    this.raw_data = fse.readFileSync(path, 'utf8') || ''
    this.records = extract(this.raw_data)

    // catch non-NC filetypes until implemented
    if (this.records === null) {
      return null
    }

    let keywordSet = new Set()
    for (let rec of this.records) {
      let kw = rec.keyword
      if (kw !== undefined) {
        keywordSet.add(kw)
      }
    }
    this.keywords = Array.from(keywordSet)

    let errCnt = 0
    this.counts = []
    for (let k of this.keywords) {
      let cnt = 0
      let err = false

      for (let rec of this.records) {
        let kw = rec.keyword

        if (kw !== undefined && kw === k) {
          cnt++
          if (rec.errors.length > 0) errCnt++
          if (!err) err = (rec.errors.length > 0)
        }
      }
      this.counts.push({keyword:k, count:cnt, errors: err})
    }
    this.counts.push({keyword: 'error', count:errCnt})

    return this
  },

  // files export to a created directory inside the source directory
  export: function() {

    let pathAry = this.path.split('/')
    let prefix = pathAry.pop().split('.')[0]
    let saveDir = pathAry.join('/') + '/' + prefix
    let filename = `${prefix}-all.psv`
    let saveFile = `${saveDir}/${filename}`

    // create all file
    if (!fse.existsSync(saveDir)) {
      fse.mkdirSync(saveDir)
    }

    let parsedData = parse(this.records)

    fse.writeFile(saveFile, parsedData, function(err) {
      if(err) return console.log(err)
    });

    let errors = []
    for (let rec of this.records) {
      if (rec.errors && rec.errors.length > 0) {
        for (let error of rec.errors) {
          errors.push(rec)
        }
      }
    }

    // create error file
    if (errors.length > 0) {
      parsedData = parse(errors)
      filename = `${prefix}-errors.psv`
      saveFile = `${saveDir}/${filename}`
      fse.writeFile(saveFile, parsedData, function(err) {
        if(err) return console.log(err)
      });
    }

    for (let el of this.keywords) {
      let holder = []
      for (let rec of this.records) {
        if (rec.keyword === el) {
          holder.push(rec)
        }
      }

      parsedData = parse(holder)
      filename = `${prefix}-${el}.psv`
      saveFile = `${saveDir}/${filename}`

      // create keyword file
      fse.writeFile(saveFile, parsedData, function(err) {
        if(err) return console.log(err)
      });
    }
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
        // handle non-NC type files until implemented
        if (rec.fileType && rec.fileType !== 'NC') {
          return null
        }

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
        case '@':
          record.type = TYPES[1] // header
          break
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
      recData.type = ddlConsts.searchKeywords(recData.keyword).type
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

// converts file json data into .psv format
function parse(records) {
  let cnt = 0
  let data = ''

  for (let r of records) {
    if (r.type === 'header') {
      data += `@${r.fileType}|${r.networkName}|${r.ncmName}|,\n`
    }

    if (r.type === 'hardware' || r.type === 'software' || r.type === 'feature') {
      let subs = ''
      if (r.subKeywords.length > 0) {
        for (let subKeyword of r.subKeywords) {
          let sub = `${subKeyword.keyword}|`

          for (let param of subKeyword.params) {
            let val = (param !== '') ? param : 'null'
            sub += `${val}|`
          }
          subs += `${sub}`
        }
      }

      cnt++
      
      let line = 
        `${cnt}|${r.keyword}|${r.network}|${r.name}|${r.description}`
        // `${r.keyword}|${r.network}|${r.id}|${r.name}|${r.description}`
      if (subs !== '') line += `|${subs}`
      line += `\n`

      data += line
    }
  }
  
  // remove trailing comma and new line
  data = data.trim().substring(0, data.length - 1)

  return data
}

// regex - everything in double quotes including quotes
// let params = data[i].match(/(["'])(?:\\.|[^\\])*?\1/g)
// for (param in params) {
//   let str = param.substr(1)
// }