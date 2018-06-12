const fse = require('fs-extra')

module.exports = {
  file: '',
  path: '',
  raw_data: '',
  records: [],

  import: function(path) {
    this.file = path.split('/').pop()
    this.path = path
    this.raw_data = fse.readFileSync(path, 'utf8') || ''
    this.records = extract(this.raw_data)

    return this
  },

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
    if (line.match(/^\s*$/)) {
      // empty line
      cnt++
      let rec = buildRecord(cnt, raw_data)
      if (rec) {
        // do not add empty records
        if (rec.type !== 'empty') {
          records.push(rec)
        }
      }

      raw_data = []
    }
    else {
      // record start
      raw_data.push(line)
    }
  }

  return records
}

function buildRecord(id, raw) {
  let types = ['empty', 'header', 'device', 'point', 'program', 'error', 'message', 'summary']
  // enum

  let type = types[0] // empty
  let keyword
  let network
  let name
  let description

  for (let i = 0; i <= raw.length - 1; i++) {

    switch(raw[i].charAt(0)) {
      case '@':
        type = types[1] // header
        break
      case '*':
        
        break
      case '~':
        
        break
      default: 
        
        break
    }
    
    // regex - everything in double quotes including quotes
    let params = raw[i].match(/(["'])(?:\\.|[^\\])*?\1/g)
    for (param in params) {
      let str = param.substr(1)
    }

    if (i === 0) {
      let el = raw[i].split(',')
      let temp = el[0].split(' ')

      switch(raw[i].charAt(0)) {
        case '*':
          type = 'info'
          break
        case '~':
          type = 'err/msg'
          break
        default: 
          type = 'record data'
          keyword = temp[0]
          network = temp[1]
          name = el[1]
          description = el[2]
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

  console.log(record)
  return record
}

function parse(records) {
  return JSON.stringify(records)
}