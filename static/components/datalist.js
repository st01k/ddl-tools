cnt = 0

// -------------------------------------------------------------------- exports
exports.init = function() {
  let list = document.getElementById('data-list')
  hideElement(list)

  let msgContainer = document.getElementById('empty-list')
  msgContainer.classList.add('grey-text', 'text-darken-3')  
  
  let msg = "select a file by clicking 'import'"  
  msgContainer.innerText = msg
}

exports.clear = function() {
  let list = document.getElementById('data-list')
  list.innerHTML = ''
  hideElement(list)
  cnt = 0
  let msgContainer = document.getElementById('empty-list')
  let msg = "select a file by clicking 'import'"  
  msgContainer.innerText = msg
  showElement(msgContainer)
}

exports.hideWithMsg = function(msg) {
  let _msg = msg || 'no data'
  
  let list = document.getElementById('data-list')
  hideElement(list)

  document.getElementById('empty-list').innerText = _msg  
}

exports.show = function() {
  let list = document.getElementById('data-list')
  showElement(list)
  hideElement(document.getElementById('empty-list'))
}

exports.render = function(data) {
  if (!data) return

  let msg = document.getElementById('empty-list')
  let list = document.getElementById('data-list')

  build(data)
  
  // listener for list collapse
  let elem = document.querySelector('.collapsible.expandable');
  let instance = M.Collapsible.init(elem, {
    accordion: false
  });

  hideElement(msg)
  showElement(list)
 }


// -------------------------------------------------------------------- utility
function hideElement(el) {
  el.classList.add('hide')
}

function showElement(el) {
  el.classList.remove('hide')
}

// --------------------------------------------------------------- construction
function build(data) {
  let list = document.getElementById('data-list')
  list.classList.add('collapsible', 'expandable')

  for (let record of data.records) {
    list.appendChild(buildListItem(record))
  }

  return list
}

function buildListItem(r) {
  let li = document.createElement('li')
  li.id = `ddl-rec-${r.id}`
  li.classList.add(r.type)

  if (r.errors.length > 0) li.classList.add('error')

  let head = buildListItemHead(r.type, r.keyword, r.network, r.name, r.description, r.errors.length)
  let body = buildListItemBody(r.subKeywords, r.comments, r.errors)

  li.appendChild(head)
  li.appendChild(body)

  return li
}

function buildListItemHead(type, kw, net, name, desc, errorsLength) {
  let head = document.createElement('div')
  let bgColor = bgColorSwitch(type)
  if (errorsLength > 0) {
    bgColor = bgColorSwitch('error')
  }

  let template = 
  `
    <div class="col s2">
      <span class="badge new left ddl-transparent" data-badge-caption="">${++cnt}</span>
    </div>
    <div class="col s2">${kw}</div>
    <div class="col s2">${net}</div>
    <div class="col s2">${name}</div>
    <div class="col s4">${desc}</div>
  `
  head.classList.add(bgColor, 'collapsible-header', 'white-text', 'center-align', 'valign-wrapper')
  head.innerHTML = template
  return head
}

function bgColorSwitch(type) {
  switch(type) {
    case 'error':
      return 'ddl-red'
      break
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

function buildListItemBody(subs, comms, errs) {
  let body = document.createElement('div')
  body.classList.add('collapsible-body', 'ddl-dark-grey', 'white-text', 'truncate')

  let itemData = buildListItemBodyData(subs)
  let itemComments = buildListItemBodyComments(comms)
  let itemErrors = buildListItemBodyErrors(errs)

  body.appendChild(itemData)
  body.appendChild(itemComments)
  body.appendChild(itemErrors)

  return body
}

function buildListItemBodyData(subs) {
  let data = document.createElement('div')
  data.classList.add('col', 's12')

  if (subs.length > 0) {
    let ul = document.createElement('ul')

    for (let sub of subs) {
      let li = document.createElement('li')
      li.innerText = `${sub.keyword}: `

      // reverse params for right float
      let revParams = []
      for (let param of sub.params) {
        revParams.unshift(param)
      }

      for (let param of revParams) {
        let badge = document.createElement('span')
        badge.classList.add('new', 'badge', 'param', 'ddl-light-grey')
        badge.setAttribute('data-badge-caption', '')
        badge.innerText = param
        li.appendChild(badge)
      }
      ul.appendChild(li)
    }  
    data.appendChild(ul)
  }
  else {
    let msg = document.createElement('p')
    msg.innerText = 'no data attached to this object'
    data.appendChild(msg)
  }

  return data
}

function buildListItemBodyComments(comms) {
  let comments = document.createElement('pre')
  comments.classList.add('col', 's12')

  let code = document.createElement('code')
  
  let template = ''

  if (comms.length > 0) {
    for (let line of comms) {
      template += `${line}`
    }
  }
  
  code.innerText = template
  comments.appendChild(code)
  return comments
}

function buildListItemBodyErrors(errs) {
  let errors = document.createElement('div')
  errors.classList.add('col', 's9')

  let subkeyword = document.createElement('p')
  subkeyword.classList.add('ddl-red-text')

  let message = document.createElement('p')

  if (errs.length > 0) {
    for (let err of errs) {
      // syntax
      if (err.subkeyword !== '') {
        subkeyword.innerText = `ERROR IN ${err.subkeyword}`
        message.innerText = err.msg.substring(1, err.msg.length - 1)
      }
      // semantic
      else {
        subkeyword.innerText = 'ERROR IN OBJECT'
        message.innerText = err.msg.substring(10, err.msg.length - 1)
      }
    }
  }

  errors.appendChild(subkeyword)
  errors.appendChild(message)

  return errors
}