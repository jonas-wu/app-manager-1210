const LOGIN_COOKIE_NAME = 'sessionId'
const LOGIN_USER_TYPE = 'userType'
export function isAuthenticated () {
  return _getCookie(LOGIN_COOKIE_NAME)
}

export function userType () {
  return _getType (LOGIN_USER_TYPE)
}

export function authenticateSuccess (token,type) {
  _setCookie(LOGIN_COOKIE_NAME, token)
  _setUserType(LOGIN_USER_TYPE,type)
}

export function logout () {
  _setCookie(LOGIN_COOKIE_NAME, '', 0)
  _setUserType(LOGIN_USER_TYPE,'')
}

function _getCookie (name) {
  let start, end
  if (document.cookie.length > 0) {
    start = document.cookie.indexOf(name + '=')
    if (start !== -1) {
      start = start + name.length + 1
      end = document.cookie.indexOf(';', start)
      if (end === -1) {
        end = document.cookie.length
      }
      return unescape(document.cookie.substring(start, end))
    }
  }
  return ''
}

function _setCookie (name, value, expire) {
  let date = new Date()
  date.setDate(date.getDate() + expire)
  document.cookie = name + '=' + escape(value) + '; path=/' +
    (expire ? ';expires=' + date.toGMTString() : '')
}


function _getType (type) {
  let start, end
  if (document.cookie.length > 0) {
    start = document.cookie.indexOf(type + '=')
    if (start !== -1) {
      start = start + type.length + 1
      end = document.cookie.indexOf(';', start)
      if (end === -1) {
        end = document.cookie.length
      }
      return unescape(document.cookie.substring(start, end))
    }
  }
  return ''
}

function _setUserType (type, value, expire) {
  let date = new Date()
  date.setDate(date.getDate() + expire)
  document.cookie = type + '=' + escape(value) + '; path=/' +
    (expire ? ';expires=' + date.toGMTString() : '')
}