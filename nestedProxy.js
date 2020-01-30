'use strict';

let state = {};

function createHandler(updateProp) {
  return {
    set: (obj, prop, value) => {
      obj[prop] = value;
      // console.log(updateProp);
      // updateDOM(updateMap[prop], value);
      return true;
    }
  };
}

let depth = 0;
let path = '';

function recurseObjectAndInsertProxy(obj) {
  for (const prop in obj) {
    if (typeof obj[prop] === 'object' && obj[prop] !== null && !obj[prop].length) {
      console.log('On:', prop, depth);
      if (depth === 0) {
        path = prop;
      }
      else {
        path += `.${prop}`;
      }
      console.log(path);
      obj[prop] = new Proxy(obj[prop], createHandler(path));
      depth++;
      recurseObjectAndInsertProxy(obj[prop]);
      depth = 0;
    }
  }

  return obj;
}


/*
  Creates a SuperHTML state object given an object

  @param {Object} stateObject - input state object
  @return {Object} - proxied version of input state object
*/
function createState(stateObject) {
  const handler = {
    set: (obj, prop, value) => {
      obj[prop] = value;
      // updateDOM(updateMap[prop], value);
      return true;
    }
  };

  // Nest proxies for object state mutations
  stateObject = recurseObjectAndInsertProxy(stateObject);

  state = new Proxy(stateObject, handler);

  return state;
}

const obj = {
  nested1: {
    nested2: {
      nested3: {
        value: 'foo'
      }
    }
  },
  nested21: {
    nested22: {
      nested23: {
        value: 'foo'
      }
    }
  }
};

createState(obj);
