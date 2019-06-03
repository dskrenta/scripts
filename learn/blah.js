'use strict';

const arr = [1, 2, 3];

/*
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

function callback(cb) {
  setTimeout(() => {
    cb();
  }, 1000)
}

const cb = () => console.log('foo');

callback(cb);


