'use strict';

const num = 1;
const bool = true;
const str = `Hi, it's me Rachel.`;
const func = (foo = 'stuff') => {
  console.log(foo);
};
const obj = {
  num: 1,
  bool: false,
  str: 'haha',
  func: (ha = 'Fucking define a value you piece of shit') => {
    console.log(ha);
  },
  obj: {
    name: 'Rachel'
  }
};

/*
console.log(obj);
console.log(obj.bool);
console.log(obj.obj.name);
obj.obj.name = 'David';
console.log(obj.obj['name']);
obj.func('Alright, jeez');
*/

const david = {
  'height': 165,
  'weight': 170,
  'name': 'david'
};

class Person {
  constructor(height, weight, name) {
    this.height = height;
    this.weight = weight;
    this.name = name;
  }

  toString() {
    console.log(`Height: ${this.height}, Weight: ${this.weight}, Name: ${this.name}`);
  }
}

/*
const david2 = new Person(165, 170, 'David');
console.log(david2);
david2.toString();
*/

/*
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const arr2 = [];

for (let item of arr) {
  arr2.push(item*2);
}

console.log(arr, arr2);

const arr3 = arr.map(item => item * 2);
console.log(arr3);

const arr4 = arr3.filter(item => item < 10);
console.log(arr4);
*/

/*
const names = [
  'David',
  'Rachel'
];

const nameStr = 'Hi ' + names[0] + ', and ' + names[1];
const nameStr1 = `Hi ${names[0]}, and ${names[1]}`;
console.log(nameStr, nameStr1);
*/

const rachel = {
  height: 140,
  weight: 137,
  name: 'ishmael',
  bio: 'She is 14 years old.',
  favoritePasstime: 'Magic the Gathering'
}

console.log(`Hi my name is ${rachel.name}, I weigh ${rachel.weight} pounds, my favorite passtime is
${rachel.favoritePasstime}.........................................................................`);

