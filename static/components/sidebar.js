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
  let div = document.createElement('div')
  let ul = document.createElement('ul')

  for (let keyword of data.keywords) {
    let li = document.createElement('li')
    let template = 
    `
    <label for="show-${keyword}">
      <input id="show-${keyword}" name="show-${keyword}" class="checkbox" type="checkbox" checked />
      <span class="">Show ${keyword}</span>
    </label>
    `
    li.innerHTML = template
    ul.appendChild(li)
  }

  div.appendChild(ul)
  return div
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