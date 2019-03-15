'use strict';

function safeObject(obj) {
  const handler = {
    get: (obj, prop) => {
      return prop in obj ? obj[prop] : null;
    }
  }

  const proxy = new Proxy(obj, handler);

  return proxy;
}

module.exports = safeObject;