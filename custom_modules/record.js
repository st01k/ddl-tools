module.exports = {
  id: 0,
  type: null,
  raw_data: [],
  data: null,

  isEmpty: function() {
    return this.id === 0 && this.type === null && this.data === null
  },

  hasCleanData: function() {
    return this.data !== null
  },

  clear: function() {
    this.id = 0
    this.type = null
    this.raw_data = []
    this.data = null
  }
}

// let rec
// rec = record

// rec.constructor(3, 'point', )
// rec.setData('test data')


// console.log(rec)
// console.log(rec.isEmpty())

// for (let key in rec) {
//   // console.log(`${key} : ${record[key]}`)
//   console.log(`${key}`)
// }