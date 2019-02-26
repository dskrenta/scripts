function batcher() {
  return setInterval(() => {
    console.log('batch running');
    for (let func of target.functions) {
      console.log(`running ${func.func} in batch`);
    }
  }, 200);
}

function cleanBatcher(intervalId) {
  clearInterval(intervalId);
}

const handler = {
  set: (obj, prop, value) => {
    if (prop === 'functions') {
      obj[prop].push(value);
    }
    else {
      obj[prop] = value;
    }

    return true;
  }
};

const target = {
  functions: []
};

const proxy = new Proxy(target, handler);
const batch = batcher();

proxy.functions.push({ func: 'somefunc1' });
proxy.functions.push({ func: 'somefunc2' });
proxy.functions.push({ func: 'somefunc3' });
proxy.functions.push({ func: 'somefunc4' });
proxy.functions.push({ func: 'somefunc5' });

setTimeout(() => {
  proxy.functions.push({ func: 'somefunc6' });
  proxy.functions.push({ func: 'somefunc7' });
}, 200);

// cleanBatcher(batch);

// have batcher running for all functions. 

