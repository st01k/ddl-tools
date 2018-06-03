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
    let cnt = 0
    let records = []
    let raw_data = []

    for (const line of lines) {
      if (line.match(/^\s*$/)) {
        // empty line
        // console.log('empty line')
        cnt++
        let rec = this.buildRecord(cnt, raw_data)
        if (rec) {
          if (rec.type !== 'empty') {
            records.push(rec)
          }
        }

        raw_data = []
      }
      else {
        // record start
        // console.log('record line')
        raw_data.push(line)
      }
    }

    // for (let i = 0; i <= records.length - 1; i++) {
    //   if (records[i].type == 'empty') {
    //     console.log(`removing record ${records[i].id} [${records[i].type}]`)
    //     records.splice(i, 1)
    //   }
    // }

    return records
  },

  buildRecord(id, raw) {
    let type = 'empty'
    // regex - everything in double quotes: (["'])(?:\\.|[^\\])*?\1

    for (let i = 0; i <= raw.length - 1; i++) {
      switch(raw[i].charAt(0)) {
        case '@':
          // file info
          // console.log('file info')
          type = 'info'
          break
        case '*':
          // comment
          // console.log('comment')
          type = 'comment'
          break
        case '~':
          // error/message
          // console.log('error/message')
          type = 'err/msg'
          break
        default: 
          type = 'record data'
          break
      }
    }

    let record = {
      id: id,
      type: type,
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