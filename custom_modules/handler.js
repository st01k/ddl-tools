const fse = require('fs-extra')

let cnt = 1

module.exports = {
  file: '',
  raw_data: '',
  records: [],

  import: function(path) {
    this.file = path
    this.raw_data = fse.readFileSync(path, 'utf8') || ''
    this.records = this.extract()

    return this
  },

  extract: function() {
    let lines = this.raw_data.split('\n')
    return this.buildRecords(lines)

    
    console.log(records[0])
    console.log(records[1])
    console.log(records[2])
    console.log(records[3])
    console.log(records[4])
    console.log(records[5])
    console.log(records[6])
    console.log(records[7])
    console.log(records[8])
    console.log(records[9])
    console.log(records[10])
    console.log(records[records.length - 4])
    console.log(records[records.length - 3])
    console.log(records[records.length - 2])
    console.log(records[records.length - 1])
  },

  buildRecords: function(lines) {
    let cnt = 0
    let type = ''
    let records = []
    let raw_data = []

    for (const line of lines) {
      // switch(line.charAt(0)) {
      //   case '@':
      //     // file info
      //     // console.log('file info')
      //     type = 'file info'
      //     break
      //   case '*':
      //     // comment
      //     // console.log('comment')
      //     type = 'comment'
      //     break
      //   case '~':
      //     // error/message
      //     // console.log('error/message')
      //     type = 'err/msg'
      //     break
      //   default: 
      //     type = 'record data'
      //     break
      // }

      if (line.match(/^\s*$/)) {
        // empty line
        // console.log('empty line')
        cnt++
        let rec = this.buildRecord(cnt, raw_data)
        records.push(rec)

        raw_data = []
      }
      else {
        // record start
        // console.log('record line')
        raw_data.push(line)
      }
    }

    return records
  },

  buildRecord(id, raw) {
    let record = {
      id: id,
      type: 'test',
      raw: raw,
      data: {},
      comment: {}
    }
    return record
  },

  parse: function() {

  },

  export: function() {

  }
}