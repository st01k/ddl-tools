const datalist = require('./datalist')

// -------------------------------------------------------------------- exports
exports.clear = function() {
  document.getElementById('side-bar').innerHTML = ''
}

exports.render = function(data) {
  let sidebar = document.getElementById('side-bar')

  let fileInfo = document.createElement('div')
  fileInfo.appendChild(buildFileInfo(data))

  let popData = document.createElement('div')
  popData.appendChild(buildPopData(data))

  sidebar.appendChild(fileInfo)
  sidebar.appendChild(popData)

  initView()
}

// --------------------------------------------------------------- construction
function buildFileInfo(data) {
  let ul = document.createElement('ul')

  let template = 
  `
    <li>
      <p class="sub-text ddl-light-grey-text">${data.path}</p>
      <div class="row">
        <div class="col s6"><h6>${data.head.networkName}</h6></div>
        <div class="col s6">
          <span id="total" class="new badge ddl-blue" data-badge-caption="records">
            ${data.totRecs}
          </span>
        </div>
      </div>
    </li>
    <li>
      <p>${data.head.ncmName}</p>
    </li>
  `

  ul.innerHTML = template
  return ul
}

function buildPopData(data) {
  let ul = document.createElement('div')
  // TODO: make this dynamic
  let template = 
  `
  <ul class="checkboxes">
    <li>
      <label for="show-hardware">
        <input id="show-hardware" name="show-hardware" class="checkbox" type="checkbox" checked/>
        <span class="ddl-green-text">Show Hardware</span>
      </label>
    </li>
    <li>
      <label for="show-software">
        <input id="show-software" name="show-software" class="checkbox" type="checkbox" checked/>
        <span class="ddl-purple-text">Show Software</span>
      </label>
    </li>
    <li>
      <label for="show-feature">
        <input id="show-feature" name="show-feature" class="checkbox" type="checkbox" checked/>
        <span class="ddl-yellow-text">Show Features</span>
      </label>
    </li>
    <li>
      <label for="show-error">
        <input id="show-error" name="show-error" class="checkbox" type="checkbox" checked/>
        <span class="ddl-red-text">Show Errors</span>
      </label>
    </li>
  </ul>
  `

  ul.innerHTML = template
  return ul
}

// ------------------------------------------------------------------ listeners
function initView() {
  let checks = document.getElementsByClassName("checkbox")

  // checkbox listeners
  for (let check of checks) {
    check.onchange = function() {

      let targetClass = event.target.id.split('-').pop()

      lis = document.getElementsByClassName(targetClass)
      if (check.checked) {
        for (let li of lis) {
          li.classList.remove('hide')
        }
      }
      else {
        for (let li of lis) {
          li.classList.add('hide')
        }
      }

      if (dataListIsHidden()) {
        datalist.hideWithMsg()
      }
    }
  }
}

function dataListIsHidden() {

  let list = document.getElementById('data-list').children
  for (let item of list[0].childNodes) {
    if (!item.classList.contains('hide')) return false
  }
  return true  
}