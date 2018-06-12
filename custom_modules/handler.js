const fse = require('fs-extra')

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
      let rec = buildRecord(cnt, raw_data)

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

function buildRecord(id, raw) {
  let types = ['empty', 'header', 'summary', 'error', 'device', 'point', 'program']
  // enum

  let type = types[0] // empty
  let keyword
  let network
  let name
  let description

  // iterate through each line of the record data
  for (let i = 0; i <= raw.length - 1; i++) {

    if (raw[i].charAt(0) === '@') {
      type = types[1] // header
      handleHeader()
    }
    
    // regex - everything in double quotes including quotes
    // let params = raw[i].match(/(["'])(?:\\.|[^\\])*?\1/g)
    // for (param in params) {
    //   let str = param.substr(1)
    // }

    if (i === 0) {
      let ary = raw[i].split(',')
      let temp = ary[0].split(' ')

      switch(raw[i].charAt(0)) {
        case '*':
          type = types[2] // summary
          break
        case '~':
          type = types[3] // global error
          break
        default: 
          type = 'record'
          keyword = temp[0]
          network = temp[1]
          name = ary[1]
          description = ary[2]
          break
      }
    }
  }

  let record = {
    id: id,
    type: type,
    raw: raw,
    data: {
      keyword: keyword,
      network: network,
      name: name,
      description: description,
      params: [],
      subKeywords: [],
      comment: {},
      errors: []
    }
  }

  console.log(record.type)
  return record
}

function handleHeader() {
  console.log('handling header')
}

function handleSummary() {
  console.log('handling summary')
}

function handleError() {
  console.log('handling error')
}

function handleComment() {
  console.log('handling comment')
}

function parse(records) {
  return JSON.stringify(records)
}