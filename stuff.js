'use strict';

// callback function
function iLikeCallbacks(stuff, cb) {
  cb(`${stuff} and other stuff`);
}

// promisified callback function
function iLikeCallbacksWithPromises(stuff) {
  return new Promise((resolve, reject) => {
    iLikeCallbacks(stuff, (message) => {
      resolve(message);
    })
  });
}

// callback hell
iLikeCallbacks('fuck', (message) => {
  const first = message;
  iLikeCallbacks('fuck', (message) => {
    const second = message;
    iLikeCallbacks('fuck', (message) => {
      const third = message;
      console.log(first, second, third);
    }); 
  }); 
});   

// async await
async function main() {
  try {
    const first = await iLikeCallbacksWithPromises('fuck');
    const second = await iLikeCallbacksWithPromises('fuck');
    const third = await iLikeCallbacksWithPromises('fuck');

    console.log(first, second, third);

    const otherShitNotWorthLookingAt = [];
    for (let i = 0; i < 100; i++) {
      otherShitNotWorthLookingAt.push(iLikeCallbacksWithPromises('stuff I do not want to talk about'));
    }

    const results = await Promise.all(otherShitNotWorthLookingAt);

    for (let result of results) {
      console.log(result);
    }
  }
  catch (error) {
    console.error(error);
  }
}

main();