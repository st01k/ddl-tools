const electron = require('electron')
const { ipcRenderer } = electron
const datalist = require('./js/datalist')

let handler_data

// modals
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems);
});

// import submit
document.getElementById("import-submit").addEventListener("click", (event => {
  const { path } = document.getElementById('form-import-file').files[0]
  
  if (!path) return

  clearContent()
  M.toast({ html: 'importing data'})

  setTimeout(() => {
    ipcRenderer.send('file:import', path)
  }, 750)
}))

// export submit
document.getElementById("export-submit").addEventListener("click", (event => {
  if (!handler_data) {
    M.toast({ html: 'please import a file first'})
    return
  }
  
  ipcRenderer.send('file:export', handler_data)
}))

function initView() {
  // record list collapse
  var elem = document.querySelector('.collapsible.expandable');
  var instance = M.Collapsible.init(elem, {
    accordion: false
  });

  // init no data display
  let checks = document.getElementsByClassName("checkbox")
  let msg = document.createElement('h4')
  msg.id = 'no-data'
  msg.classList.add('grey-text', 'text-darken-3', 'landing-text', 'hide')
  msg.innerHTML = 'no data to display'
  document.getElementById('data-list').appendChild(msg)

  // checkbox listeners
  for (let check of checks) {
    check.onchange = function() {

      let boxClass = event.target.id.split('-').pop()

      lis = document.getElementsByClassName(boxClass)
      if (check.checked) {
        for (let li of lis) li.classList.remove('hide')
      }
      else {
        for (let li of lis) li.classList.add('hide')
      }

      if (dataListIsHidden()) {
        // hide ul in data-list
        // show no data msg
        msg.classList.remove('hide')
        console.log('data is hidden')
      }
      else {
        
        msg.classList.add('hide')
        console.log('data is NOT hidden')
      }
    }
  }
}

function dataListIsHidden() {

  let list = document.getElementById('data-list').children
  for (let item of list[0].childNodes) {
    if (item.classList.contains('hide')) continue
    else return false
  }
  return true  
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
  initView()
  // document.getElementById('form-checkbox').classList.remove('hide')
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
      <p class="sub-text ddl-light-grey-text">${handler_data.path}</p>
      <div class="row">
        <div class="col s6"><h6>${head.networkName}</h6></div>
        <div class="col s6">
          <span id="total" class="new badge ddl-blue" data-badge-caption="records">
            ${handler_data.records.length}
          </span>
        </div>
      </div>
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
        <label for="form-show-hardware">
          <input id="form-show-hardware" name="form-show-hardware" class="checkbox" type="checkbox" checked/>
          <span class="ddl-green-text">Show Hardware</span>
        </label>
      </li>
      <li>
        <label for="form-show-software">
          <input id="form-show-software" name="form-show-software" class="checkbox" type="checkbox" checked/>
          <span class="ddl-purple-text">Show Software</span>
        </label>
      </li>
      <li>
        <label for="form-show-feature">
          <input id="form-show-feature" name="form-show-feature" class="checkbox" type="checkbox" checked/>
          <span class="ddl-yellow-text">Show Features</span>
        </label>
      </li>
      <li>
        <label for="form-show-error">
          <input id="form-show-error" name="form-show-error" class="checkbox" type="checkbox" checked/>
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
    <div class="col s3 valign-wrapper">${record.keyword}</div>
    <div class="col s3">
      ${record.network}
      <br>
      ${record.name}
    </div>
    <div class="col s6">${record.description}</div>
  `
  head.innerHTML = headTemplate

  let backgroundColor
  switch(record.type) {
    case 'error':
      backgroundColor = 'ddl-red'
      break
    case 'hardware':
      backgroundColor = 'ddl-green'
      break
    case 'software':
      backgroundColor = 'ddl-purple'
      break
    case 'feature':
      backgroundColor = 'ddl-yellow'
      break
    default:
      backgroundColor = 'ddl-grey'
      break
  }
  head.classList.add(backgroundColor, 'collapsible-header', 'white-text', 'center-align')
  
  let body = document.createElement('div')
  body.classList.add('collapsible-body', 'ddl-dark-grey', 'white-text', 'truncate')
  // body.innerHTML = `<span><pre>${record.subKeywords}</pre></span>`
  body.innerHTML = buildItemBody(record)

  li.appendChild(head)
  li.appendChild(body)

  return li
}

function buildItemBody(record) {
  
  let subs
  for (let sub in record.subKeywords) {
    subs += 
    `
      <div class="row">
        <div class="col s3">${sub.keyword}</div>
        <div class="col">${sub.params}</div>
      </div>
    `
  }

  let template = 
  `
    <div class="row">
      <div class="col s6">${subs}</div>
      <div class="col s6">comments if any</div>
    </div>
    <div class="row">error if any</div>
  `
  return template
}