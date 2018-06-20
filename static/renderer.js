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

// reload button
document.getElementById('reload').addEventListener('click', (event => {
  clearContent()
}))

// import inside modal - submit
document.getElementById("import-submit").addEventListener("click", (event => {
  const { path } = document.getElementById('form-import-file').files[0]
  
  if (!path) return

  clearContent()
  M.toast({ html: 'importing data'})

  setTimeout(() => {
    ipcRenderer.send('file:import', path)
  }, 2000)
}))

// export button
document.getElementById("export-submit").addEventListener("click", (event => {
  if (!handlerData) {
    M.toast({ html: 'please import a file first'})
    return
  }
  
  ipcRenderer.send('file:export', handlerData)
}))

document.getElementById("power").addEventListener("click", (event => {  
  ipcRenderer.send('power:off')
}))

datalist.init()

// ------------------------------------------------------------------------ IPC
ipcRenderer.on('file:imported', (event, data) => {
  handlerData = data

  sidebar.render({
    path: data.path,
    head: data.records.shift(),
    sum: data.records.pop(),
    totRecs: data.records.length
  })
  datalist.render(data)
})

ipcRenderer.on('file:exported', (event, data) => {
  var toastHTML = 
  `
  <span>exported ${data}</span>
  <button class="btn-flat toast-action">SHOW</button>
  `
  //TODO hook up open directory of new file
  M.toast({html: toastHTML});
})

// ------------------------------------------------------------------- utility
// clears main content and file info
function clearContent() {
  handlerData = null
  sidebar.clear()
  datalist.clear()
}
