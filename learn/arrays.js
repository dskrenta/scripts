'use strict';

function findDuplicate(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr.indexOf(arr[i]) !== i) {
      return [
        i,
        arr[i]
      ];
    }
  }
}

function maxValue(arr) {
  let max = 0;
  for (let elem of arr) {
    if (elem > max) {
      max = elem;
    }
  }
  return max;
}

function minValue(arr) {
  let min = Number.POSITIVE_INFINITY;
  for (let elem of arr) {
    if (elem < min) {
      min = elem;
    }
  }
  return min;
}

const testArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 10];

console.log(findDuplicate(testArr));
console.log(maxValue(testArr));
console.log(minValue(testArr));