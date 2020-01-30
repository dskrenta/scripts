'use strict';

function add(a, b) {
  return a + b;
}

function callbackEx(a, b, cb) {
  cb(a + b);
}

console.log(add(1, 2));

callbackEx(1, 2, (sum) => console.log(sum))

callbackEx(1, 2, (sum) => {
  callbackEx(sum, 4, (sum1) => {
    callbackEx(sum1, 3, (sum2) => {
      console.log(sum2);
    })
  })
})

function funcThatReturnsPromise(value, mills) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(value);
    }, mills);
  });
}

/*
funcThatReturnsPromise('foo', 1000)
  .then(foo => console.log(foo))
  .catch(err => console.error(error))
  */

async function someFunc() {
  try {
    const arr = [
      funcThatReturnsPromise('some other shit', 1000),
      funcThatReturnsPromise('some other shit', 1000),
      funcThatReturnsPromise('some other shit', 1000)
    ];
    const res = await Promise.all(arr);
    console.log(res);
  }
  catch (error) {
    console.error(error);
  }
}

someFunc();
