const datalist = require('./datalist')
const ddlConsts = require('../../custom_modules/ddl-constants')

// -------------------------------------------------------------------- exports
exports.clear = function() {
  document.getElementById('side-bar').innerHTML = ''
}

exports.render = function(data) {
  let sidebar = document.getElementById('side-bar')

  let pd = buildPopData(data)
  let fi = buildFileInfo(data)  

  let fileInfo = document.createElement('div')
  fileInfo.appendChild(fi)

  let popData = document.createElement('div')
  popData.appendChild(pd)

  sidebar.appendChild(fileInfo)
  sidebar.appendChild(popData)

  initView()
}

// --------------------------------------------------------------- construction
let errCount = 0

function buildFileInfo(data) {
  let ul = document.createElement('ul')

  let template = 
  `
    <li>
      <p>Source File Path</p>
      <span class="sub-text ddl-light-grey-text">${data.path}</span>
      <hr>
    </li>
    <li>      
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
      <div class="row">
        <div class="col s6"><p>${data.head.ncmName}</p></div>
        <div class="col s6">
          <span id="total" class="new badge ddl-red" data-badge-caption="errors">
            ${errCount}
          </span>
        </div>
      </div>
    </li>
    <hr>
  `

  ul.innerHTML = template
  return ul
}

function buildPopData(data) {
  let div = document.createElement('div')
  let ul = document.createElement('ul')

  for (let keyword of data.keywords) {
    let count
    let color = 'ddl-blue'

    for (let kw of data.counts) {
      if (kw.keyword === keyword) {
        count = kw.count
        if (kw.errors) {
          color = bgColorSwitch('error')
        }
        else color = bgColorSwitch(kw.keyword)
      }
      if (kw.keyword === 'error') errCount = kw.count
    }

    let li = document.createElement('li')
    let template = 
    `
    <div>
      <label for="show-${keyword}">
        <input id="show-${keyword}" name="show-${keyword}" class="checkbox" type="checkbox" checked />
        <span class="">${keyword}</span>
      </label>
      <span class="new badge ${color}" data-badge-caption="">
        ${count}
      </span>
    </div>
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

      // if all are unchecked
      if (dataListIsHidden()) {
        datalist.hideWithMsg('no data')
      }
      else {
        datalist.show()
      }
    }
  }
}

function bgColorSwitch(kw) {
  if (kw === 'error') return 'ddl-red'
  let type = ddlConsts.searchKeywords(kw).type
  switch(type) {
    case 'hardware':
      return 'ddl-green'
      break
    case 'software':
      return 'ddl-purple'
      break
    case 'feature':
      return 'ddl-yellow'
      break
    default:
      return 'ddl-grey'
      break
  }
}

function dataListIsHidden() {

  let checks = document.getElementsByClassName("checkbox")

  for (let check of checks) {
    if (check.checked) return false
  }
  return true
}