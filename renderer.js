const electron = require('electron')
const { ipcRenderer } = electron

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault()

  const { path } = document.querySelector('input').files[0]
  ipcRenderer.send('file:import', path)
})

ipcRenderer.on('file:handler', (event, handler) => {
  document.querySelector('#data').innerHTML = `total records: ${handler.records.length}`

  let ul = document.querySelector('#data-list')
  for (let record of handler.records) {
    let li = document.createElement('li')
    li.appendChild(document.createTextNode(
      // record.id + ' ' + record.type + ' ' + record.raw
      `ID: ${record.id} | TYPE: ${record.type} | DATA: ${record.raw}`
    ))
    ul.appendChild(li)
  }
})