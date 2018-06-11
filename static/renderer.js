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
  M.toast({ html: 'data file imported'})
  ipcRenderer.send('file:import', path)
}))

// export submit
document.getElementById("export-submit").addEventListener("click", (event => {
  if (!handler_data) {
    M.toast({ html: 'please import a file first'})
    //TODO clear export input
    return
  }
  M.toast({ html: 'generating PSV'})
}))

function addListListener() {
  // record list collapse
  document.addEventListener('DOMContentLoaded', function() {
    // var elems = document.querySelectorAll('.collapsible.expandable');
    // var instances = M.Collapsible.init(elems, {
    //   accordion: false
    // });

    var elem = document.querySelector('.collapsible.expandable');
    var instance = M.Collapsible.init(elem, {
      accordion: false
    });
  });
}

// ------------------------------------------------------------------------ IPC
ipcRenderer.on('file:handler', (event, handler) => {
  clearContent()
  handler_data = handler
  
  renderFileInfo()

  let div = document.querySelector('#content-body')
  let ul = document.createElement('ul')
  ul.classList.add('collapsible', 'expandable', 'popout')
  
  for (let record of handler.records) {
    ul.appendChild(genListItem(record))
  }
  div.appendChild(ul)
})

// -------------------------------------------------------------------data propogation
// clears main content and file info
function clearContent() {
  document.getElementById('file-name').innerHTML = ''
  document.getElementById('total-records').innerHTML = ''
  document.getElementById('content-body').innerHTML = ''
}

// renders file info
function renderFileInfo() {
  let names = handler_data.file.split('/')
  let name = names[names.length - 1]
  document.getElementById('file-name').innerHTML = `${name}`
  
  document.getElementById('total-records').innerHTML = `Total Records: ${handler_data.records.length}`
}

// returns list item
function genListItem(record) {
  let li = document.createElement('li')
  
  let head = document.createElement('div')
  head.classList.add('collapsible-header', 'grey', 'darken-2', 'white-text')
  //TODO add header icon <i class="material-icons">whatshot</i>
  head.innerHTML = `${record.data.keyword} ${record.data.network} ${record.data.name} ${record.data.description}<br> TYPE: ${record.type}`
  
  let body = document.createElement('div')
  body.classList.add('collapsible-body', 'grey', 'darken-3', 'white-text', 'truncate')
  body.innerHTML = `<span><pre>${record.raw}</pre></span>`

  li.appendChild(head)
  li.appendChild(body)

  return li
}