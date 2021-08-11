const obj = {
  subscription: {
    addonIds: [],
    equipment: null,
    planIds: ["1"],
    serviceAddress: {
      address1: "1100 Veterans Blvd",
      address2: null,
      city: "Redwood City",
      state: "CA",
      zip: "94063",
    },
    subscriptionDiscounts: []
  }
}

function objView (obj) {
  let str = '<ul>'

  function recurse(obj) {
    for (const key in obj) {
      if (isObject(obj[key])) {
        str += `<li>${key}</li><ul>`
        recurse(obj[key])
      } else if (Array.isArray(obj[key]) && obj[key].length > 0) {
        str += `<li>${key}</li><ul>${obj[key].map(val => `<li>${val}</li>`).join('')}</ul>`
      } else if (typeof obj[key] === 'number' || typeof obj[key] === 'string') {
        str += `<li>${key}</li><ul><li>${obj[key]}</li></ul>`
      }
    }

    str += '</ul>'
  }

  recurse(obj)

  return str
}

function isObject (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

console.log(objView(obj))
