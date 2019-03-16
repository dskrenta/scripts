'use strict';

function isObject(value) {
  return value && typeof value === 'object' && value.constructor === Object;
}

// add nested option (obj, nested = false) -> nested set to true returns another proxied object instead of null
function safeObject(obj) {
  const handler = {
    get: (obj, prop) => {
      if (isObject(obj[prop])) {
        return new Proxy(obj[prop], handler);
      }
      else if (prop in obj) {
        return obj[prop];
      }
      else {
        return null;
      }
    }
  };

  const proxy = new Proxy(obj, handler);

  return proxy;
}

const testObj = {
  name: 'David',
  age: 20,
  stuff: {
    otherStuff: 'foo'
  }
};

const obj = safeObject(testObj);

console.log(obj.haha);
console.log(obj.stuff.sdf);
console.log(obj.name);

module.exports = safeObject;