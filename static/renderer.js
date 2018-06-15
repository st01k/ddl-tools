const electron = require('electron')
const { ipcRenderer } = electron

let handler_data

// modals
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems);
});

// import submit
document.getElementById("import-submit").addEventListener("click", (event => {
  const { path } = document.getElementById('form-import-file').files[0]
  
  clearContent()
  M.toast({ html: 'importing data'})

  setTimeout(() => {
    ipcRenderer.send('file:import', path)
  }, 1500)
}))

// export submit
document.getElementById("export-submit").addEventListener("click", (event => {
  if (!handler_data) {
    M.toast({ html: 'please import a file first'})
    return
  }
  
  ipcRenderer.send('file:export', handler_data)
}))

function initCollapse() {
  // record list collapse
  var elem = document.querySelector('.collapsible.expandable');
  var instance = M.Collapsible.init(elem, {
    accordion: false
  });
}

// ------------------------------------------------------------------------ IPC
ipcRenderer.on('file:handler', (event, handler) => {
  handler_data = handler

  let header = handler.records.shift()
  let summary = handler.records.pop()
  renderFileInfo(header, summary)

  let div = document.getElementById('data-list')
  let ul = document.createElement('ul')
  ul.classList.add('collapsible', 'expandable')

  for (let record of handler.records) {
    ul.appendChild(genListItem(record))
  }
  
  div.appendChild(ul)
  initCollapse()
  document.getElementById('form-checkbox').classList.remove('hide')
})

ipcRenderer.on('file:exported', (event, data) => {
  var toastHTML = `<span>exported ${data}</span><button class="btn-flat toast-action">SHOW</button>`
  //TODO hook up open directory of new file
  M.toast({html: toastHTML});
})

// ------------------------------------------------------------------- data propogation
// clears main content and file info
function clearContent() {
  document.getElementById('data-list').innerHTML = ''
  document.getElementById('file-name').innerHTML = ''
  document.getElementById('total-records').innerHTML = ''
}

// renders file info
function renderFileInfo(head, sum) {
  // file name
  let names = handler_data.file.split('/')
  let name = names[names.length - 1]
  document.getElementById('file-name').innerHTML = `${name}`
  
  // total records
  document.getElementById('total-records').innerHTML = `Total Records: ${handler_data.records.length}`

  document.getElementById('network').innerHTML = `${head.networkName}`
  document.getElementById('ncm').innerHTML = `${head.ncmName}`
  
  //TODO add summary and counts w/ color coding by type
}

// returns list item
function genListItem(record) {
  let li = document.createElement('li')
  
  let head = document.createElement('div')
  head.classList.add('collapsible-header', 'grey', 'darken-2', 'white-text')
  //TODO add header icon <i class="material-icons">whatshot</i>
  head.innerHTML = `${record.keyword} ${record.network} ${record.id} ${record.description}<br> TYPE: ${record.type}`
  
  let body = document.createElement('div')
  body.classList.add('collapsible-body', 'grey', 'darken-3', 'white-text', 'truncate')
  body.innerHTML = `<span><pre>${record.subKeywords}</pre></span>`

  li.appendChild(head)
  li.appendChild(body)

  return li
}