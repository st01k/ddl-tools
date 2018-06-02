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
    let records = []
    let raw_data = []

    for (const line of lines) {
      if (line === '\r') {
        cnt++

        records.push({
          id: cnt, 
          type: 'test type', 
          raw: raw_data, 
          data: {},
          comment: {}
        })

        raw_data = []
      } 
      else {
        console.log(line)
        raw_data.push(line)
      }
    }

    return records
  },

  parse: function() {

  },

  export: function() {

  }
}