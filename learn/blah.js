'use strict';

const fetch = require('node-fetch');

const numWorkers = 10;

const urls = [];

function addUrl(url) {
  urls.push(url);
}

async function worker() {
  try {
    const url = urls.pop();
    const res = await fetch(url);
    const text = await res.text();
    console.log(text);
    if (urls.length > 0) {
      worker();
    }
    else {
      return;
    }
  }
  catch (error) {
    console.error(error);
  }
}

async function init() {
  try {
    const workers = [];
    for (let i = 0; i < numWorkers; i++) {
      workers.push(worker());
    }
    await Promise.all(workers);
  }
  catch (error) {
    console.error(error);
  }
}

for (let i = 0; i < 100; i++) {
  addUrl('https://google.com');
}

init();

/*
function blah(num) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject();
      // reject('Error: go fuck yourself, i am not going to compute that');
      // resolve(num ** 2 / 83);
    }, 1000)
  });
}

async function main() {
  try {
    const nums = [234, 454, 234, 753, 565, 345, 456, 345];
    const numPromises = nums.map(num => blah(num));
    console.log(numPromises);
    const final = await Promise.all(numPromises);
    console.log(final);
  }
  catch (error) {
    console.error(error);
  }
}

main();
*/

/*
function blahBix(one, two, three) {
  console.log(`${one}, go fuck yourself, ${two} go thrice to nice, ${three}, I can pee...`);
}

// blahBix(`Haha, you don't know anything about the real lizard people`, `please don't talk to me when I am scooting on my lime`, `Appearix rocks`);

const obj = {
  one: 1,
  two: 2,
  three: 3,
  four: 4
};

const { one, two } = obj;

function stuff({
  one,
  two = 'piece of shit',
  three = 'stuff',
  four
}) {
  console.log(`${one}, go fuck yourself, ${two} go thrice to nice, ${three}, I can pee...`);
  console.log(four);
}

stuff(obj);
stuff({one: 1, four: 2});

const newObj = {
  one: 'one',
  two: 'two',
  ...obj
};

console.log(newObj);

const newObj2 = {
  ...obj,
  one: 'one',
  two: 'two'
};

console.log(newObj2);

const arr = [1, 2, 3, 4];
const arr1 = [...arr, 5, 6, 7, ...arr];

console.log(arr1);
*/

/*
const fs = require('fs');
const { promisify } = require('util');
const fetch = require('node-fetch');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

async function main() {
  try {

  }
  catch (error) {
    console.error(error);
  }
}
*/

/*
async function writeSWAPIPeopleToFile() {
  try {
    const res = await fetch('https://swapi.co/api/people/');
    const people = await res.json();
    await writeFileAsync('./starsWarsPeople.json', JSON.stringify(people, null, 2));
  }
  catch (error) {
    console.error(error);
  }
}

writeSWAPIPeopleToFile();
*/

/*
fs.writeFile('./foo.txt', 'some text', (err) => {
  if (err) {
    console.error(error);
  }
  else {
    console.log('file write successful');
    fs.readFile('./foo.txt', 'utf-8', (err, data) => {
      if (err) {
        console.error(error);
      }
      else {
        console.log(data);
      }
    });
  }
});
*/


/*
async function doSameThing() {
  try {
    await writeFileAsync('./fooyou.txt', 'some other text');
    const data = readFileAsync('./fooyou.txt', 'utf-8');
    console.log(data);
  }
  catch (error) {
    console.error(error);
  }
}

doSameThing();
*/

/*
const arr = [1, 2, 3];

const raisedBy2 = arr.map(function (num) {
  return num ** 2;
});
*/

/*
for (let num of arr) {
  const index = arr.indexOf(num);
  arr[index] = num ** 2;
}
*/

/*
const raisedBy2 = arr.map((num, index) => num ** index);

console.log(raisedBy2);

// map, filter, reduce

const reduced = raisedBy2.reduce((sum, curr) => sum + curr);

console.log(reduced);

const blah = raisedBy2.filter(num => num > 2);

console.log(blah);

raisedBy2.forEach(val => console.log(val));

// IFEE

(() => {

})();

((foo) => {
  console.log(foo);
})(foo);

const obj  = {
  sd: [2, 4, 2],
  bls: '234wddsfs',
  sdf: true,
  dsf: 3,
  sdf: {
    name: 'foo'
  },
  func: () => {
    console.log(foo);
    return null;
  }
};

for (let key in obj) {
  console.log(key, obj[key]);
}

console.log(Object.values(obj));
console.log(Object.keys(obj));
console.log(Object.entries(obj));

Array.prototype.blah = () => console.log('foo');
*/

/*
Array.prototype.stuff = () => {
  console.log(Object(this));
}

arr.stuff();

// blah.blah();
*/

/*
function callback(cb) {
  setTimeout(() => {
    cb(true);
  }, 1000)
}

const cb = () => console.log('foo');

// callback(cb);

callback((param) => {
  console.log('foo');
  callback((param) => {
    console.log('foo');
    callback((param) => {
      console.log('foo');
    })
  })
})

function foo() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(foo);
      resolve();
    }, 1000);
  });
}

async function main() {
  try {
    foo();
    foo();
    foo();
  }
  catch (error) {
    console.error(error);
  }
}
*/
