const electron = require('electron')
const { ipcRenderer } = electron

// modals
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems);
});

// import submit
document.getElementById("import-submit").addEventListener("click", (event => {
  const { path } = document.getElementById('form-import-file').files[0]
  M.toast({ html: 'parsing DDL'})
  ipcRenderer.send('file:import', path)
}))

// export submit
document.getElementById("export-submit").addEventListener("click", (event => {
  M.toast({ html: 'generating PSV'})
}))

// record list collapse
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.collapsible.expandable');
  var instances = M.Collapsible.init(elems, {
    accordion: false
  });
});

// ------------------------------------------------------------------------ IPC
ipcRenderer.on('file:handler', (event, handler) => {
  clearContent()
  document.getElementById('total-records').innerHTML = `${handler.records.length}`
  document.getElementById('filename').innerHTML = `${handler.file}`

  let ul = document.querySelector('#data-list')
  for (let record of handler.records) {
    let li = document.createElement('li')
    
    let head = document.createElement('div')
    head.classList.add('collapsible-header', 'grey', 'darken-2', 'white-text')
    head.innerHTML = `${record.data.keyword} ${record.data.network} ${record.data.name} ${record.data.description}<br> TYPE: ${record.type}`
    
    let body = document.createElement('div')
    body.classList.add('collapsible-body', 'grey', 'darken-3', 'white-text', 'truncate')
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

function clearContent() {
  document.getElementById('filename').innerHTML = ''
  document.getElementById('total-records').innerHTML = ''
  document.getElementById('data-list').innerHTML = ''
}