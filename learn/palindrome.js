'use strict';

function palindrome(str) {
  let reversedStr = '';
  for (let i = str.length - 1; i >= 0; i--) {
    reversedStr += str[i];
  }
  return reversedStr === str;
}

console.log(palindrome('racecar'));
console.log(palindrome('haah'));
console.log(palindrome('123asds'));