// ------------------------------------------------------------------------------------ exports
exports.init = function() {
  let list = document.getElementById('data-list')
  hideElement(list)

  let msgElement = document.getElementById('empty-list')
  let msg = "select a file by clicking 'import'"
  msgElement.classList.add('grey-text', 'text-darken-3')  
  msgElement.innerText = msg
}

exports.clear = function() {
  let list = document.getElementById('data-list')
  list.innerHTML = ''
  hideElement(list)

  let msgElement = document.getElementById('empty-list')
  msgElement.innerText = ''
}

exports.hideMsg = function(msg) {
  let _msg = msg || 'no data'
  
  let list = document.getElementById('data-list')
  hideElement(list)

  document.getElementById('empty-list').innerText = _msg  
}

exports.show = function() {
  let list = document.getElementById('data-list')
  showElement(list)
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


// ------------------------------------------------------------------------------------ utility
function hideElement(el) {
  el.classList.add('hide')
}

function showElement(el) {
  el.classList.remove('hide')
}

// ------------------------------------------------------------------------------------ construction
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

  let head = buildListItemHead(r.type, r.keyword, r.network, r.name, r.description)
  let body = buildListItemBody(r.subKeywords, r.comments, r.errors)

  li.appendChild(head)
  li.appendChild(body)

  return li
}

function buildListItemHead(type, kw, net, name, desc) {
  let head = document.createElement('div')
  let bgColor = bgColorSwitch(type)

  let template = 
  `
    <div class="col s3 valign-wrapper">${kw}</div>
    <div class="col s3">
      ${net}
      <br>
      ${name}
    </div>
    <div class="col s6">${desc}</div>
  `
  head.classList.add(bgColor, 'collapsible-header', 'white-text', 'center-align')
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

  if (subs) {
    let ul = document.createElement('ul')

    for (let sub of subs) {
      let li = document.createElement('li')
      li.innerText = `${sub.keyword}: `

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
  //FIXME - not printing bc there is always a sub even if empty
  else {
    let msg = document.createElement('p')
    msg.innerText = 'no sub keywords'
    data.appendChild(msg)
  }

  return data
}

function buildListItemBodyComments(comms) {
  let comments = document.createElement('pre')
  comments.classList.add('col', 's12')

  let code = document.createElement('code')
  
  let template = ''

  if (comms) {
    for (let line of comms) {
      template += `${line}`
    }
  }
  else {
    template += `no comments`
  }
  
  code.innerText = template
  comments.appendChild(code)
  return comments
}

function buildListItemBodyErrors(errs) {
  let errors = document.createElement('div')
  errors.classList.add('col', 's12', 'center-align')

  let template = ''

  if (errs) {
    for (let err of errs) {
      console.log(err)
      template += `<p>${err.type} | ${err.msg} | ${err.subkeyword}</p>`
    }
  }

  errors.innerHTML = template
  return errors
}
