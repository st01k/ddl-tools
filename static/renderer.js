const electron = require('electron')
const { ipcRenderer } = electron

const datalist = require('./components/datalist')
const sidebar = require('./components/sidebar')

let handlerData

// ------------------------------------------------------------------- listeners
// modals
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems);
});

// pdf link
document.getElementById('pdf').addEventListener('click', (event => {
  ipcRenderer.send('pdf:open')
}))

// reload button
document.getElementById('reload').addEventListener('click', (event => {
  clearContent()
}))

// import inside modal - submit
document.getElementById("import-submit").addEventListener("click", (event => {
  const { path } = document.getElementById('form-import-file').files[0]
  
  if (!path) return

  clearContent()
  M.toast({ html: '<span>importing data</span>'})

  setTimeout(() => {
    ipcRenderer.send('file:import', path)
  }, 2000)
}))

// export button
document.getElementById("export-submit").addEventListener("click", (event => {
  if (handlerData) {
    ipcRenderer.send('file:export', handlerData)
  }
  else {
    M.toast({ html: 'please import a file first'})
  }
}))

document.getElementById("power").addEventListener("click", (event => {  
  ipcRenderer.send('power:off')
}))

datalist.init()

// -------------------------------------------------------------- IPC listeners
ipcRenderer.on('file:imported', (event, data) => {
  handlerData = data
  
  sidebar.render({
    path: data.path,
    head: data.records.shift(),
    sum: data.records.pop(),
    totRecs: data.records.length,
    keywords: data.keywords
  })
  
  datalist.render(data)
})

ipcRenderer.on('file:exported', (event, path) => {
  let filename = path.split('/').pop()
  var toastHTML = 
  `
  <span>exported</span>
  <button id="show-file" class="btn-flat toast-action">OPEN</button>
  `
  
  M.toast({html: toastHTML});
  document.getElementById('show-file').addEventListener('click', (event) => {
    ipcRenderer.send('file:show', path)
  })
})

// ----------------------------------------------------------------- utilities
// clears main content and file info
function clearContent() {
  handlerData = null
  sidebar.clear()
  datalist.clear()
}
