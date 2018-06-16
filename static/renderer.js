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
  document.getElementById('side-bar').innerHTML = ''
  document.getElementById('data-list').innerHTML = ''
}

// renders file info
function renderFileInfo(head, sum) {
  let arr = handler_data.path.split('/')
  // let name = arr[arr.length - 1]
  let name = arr.pop()
  let path = arr.join('/') + '/'

  let ulf = document.createElement('ul')
  let ulc = document.createElement('ul')

  let ulfTemplate = 
  `
    <li>
      <p class="sub-text ddl-grey-text">${path}</p>
      <div class="row">
        <div class="col s8"><h6>${name}</h6></div>
        <div class="col s4">
          <span id="total" class="new badge ddl-blue" data-badge-caption="records">
            ${handler_data.records.length}
          </span>
        </div>
      </div>
    </li>
    <li>
      <p>${head.networkName}</p>
    </li>
    <li>
      <p>${head.ncmName}</p>
    </li>
  `
  ulf.innerHTML = ulfTemplate

  let ulcTemplate = 
  `
  <form action="#" id="form-checkbox">
    <hr>
    <!-- <form action="#" id="form-checkbox"> -->
    <ul class="checkboxes">
      <li>
        <label>
          <input id="form-show-hardware" class="checkbox" type="checkbox" checked/>
          <span class="ddl-grey-text">Show Hardware</span>
        </label>
      </li>
      <li>
        <label>
          <input id="form-show-software" class="checkbox" type="checkbox" checked/>
          <span class="ddl-green-text">Show Software</span>
        </label>
      </li>
      <li>
        <label>
          <input id="form-show-feature" class="checkbox" type="checkbox" checked/>
          <span class="ddl-yellow-text">Show Features</span>
        </label>
      </li>
      <li>
        <label>
          <input id="form-show-error" class="checkbox" type="checkbox" checked/>
          <span class="ddl-red-text">Show Errors</span>
        </label>
      </li>
    </ul>
  </form>
  `
  ulc.innerHTML = ulcTemplate
  
  let sideBar = document.getElementById('side-bar')
  sideBar.appendChild(ulf)
  sideBar.appendChild(ulc)
  // document.getElementById('file-name').innerHTML = `${name}`
  
  // // total records
  // document.getElementById('total-records').innerHTML = `Total Records: ${handler_data.records.length}`

  // document.getElementById('network').innerHTML = `${head.networkName}`
  // document.getElementById('ncm').innerHTML = `${head.ncmName}`
  
  //TODO add summary and counts w/ color coding by type
}

// returns list item
function genListItem(record) {
  let li = document.createElement('li')
  li.id = `ddl-rec-${record.id}`
  li.classList.add(record.type)
  
  let head = document.createElement('div')
  //TODO add header icon <i class="material-icons">whatshot</i>
  let headTemplate = 
  `
    <div class="col s2">${record.keyword}</div>
    <div class="col s3">${record.network}</div>
    <div class="col s3">${record.name}</div>
    <div class="col s5">${record.description}</div>
  `
  head.innerHTML = headTemplate

  let backgroundColor
  switch(record.type) {
    case 'error':
      backgroundColor = 'ddl-red'
      break
    case 'hardware':
      backgroundColor = 'ddl-grey'
      break
    case 'software':
      backgroundColor = 'ddl-green'
      break
    case 'feature':
      backgroundColor = 'ddl-yellow'
      break
    default:
      backgroundColor = 'ddl-purple'
      break
  }
  head.classList.add(backgroundColor, 'collapsible-header', 'white-text', 'center-align')
  
  let body = document.createElement('div')
  body.classList.add('collapsible-body', 'grey', 'darken-3', 'white-text', 'truncate')
  body.innerHTML = `<span><pre>${record.subKeywords}</pre></span>`

  li.appendChild(head)
  li.appendChild(body)

  return li
}