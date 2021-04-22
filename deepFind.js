'use strict'

const obj = {
  hey: true,
  yea: 'what',
  stuff: {
    wazup: 'ok',
    nested: {
      userId: 1,
      userIds: [1, 2, 3, 4]
    }
  }
}

function deepFind (obj, key) {
  for (const objKey in obj) {
    if (objKey === key) {
      return obj[objKey]
    }

    if (isObject(obj[objKey])) {
      return deepFind(obj[objKey], key)
    }
  }

  return null
}

function isObject (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

console.log(deepFind(obj, 'userId'))
console.log(deepFind(obj, 'userIds'))
console.log(deepFind(obj, 'heyo'))
