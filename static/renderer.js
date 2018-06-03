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
  const { path } = document.getElementById('form-import-file').files[0]
  ipcRenderer.send('file:import', path)
}))

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.collapsible');
  var instances = M.Collapsible.init(elems);
});

// ------------------------------------------------------------------------ IPC
ipcRenderer.on('file:handler', (event, handler) => {
  document.querySelector('#data').innerHTML = `total records: ${handler.records.length}`

  let ul = document.querySelector('#data-list')
  for (let record of handler.records) {
    let li = document.createElement('li')
    
    let head = document.createElement('div')
    head.classList.add('collapsible-header', 'grey', 'darken-2', 'white-text')
    head.innerHTML = `ID: ${record.id} <br> TYPE: ${record.type}`
    
    let body = document.createElement('div')
    body.classList.add('collapsible-header', 'grey', 'darken-3', 'white-text')
    body.innerHTML = `<span><pre>${record.raw}</pre></span>`
    // li.appendChild(document.createTextNode(
    //   // record.id + ' ' + record.type + ' ' + record.raw
    //   `ID: ${record.id} | TYPE: ${record.type} | DATA: ${record.raw}`
    // ))
    li.appendChild(head)
    li.appendChild(body)
    ul.appendChild(li)
  }
})
