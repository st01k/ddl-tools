const electron = require('electron')
const { ipcRenderer } = electron

// sidenav
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems);
});

// modals
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems);
});

// import submit
document.getElementById("import-submit").addEventListener("click", (event => {
  console.log('got the click')

  const { path } = document.getElementById('form-import-file').files[0]
  ipcRenderer.send('file:import', path)
}))
// document.querySelector('#import-submit').click((event) => {
//   console.log('got the click')

//   const { path } = document.querySelector('#form-import-file').files[0]
//   ipcRenderer.send('file:import', path)
// })

// ------------------------------------------------------------------------ IPC
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
