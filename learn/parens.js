'use strict';

const str = '(Hi(guys))no';

function balancedParens(str) {
  const stack = [];
  for (const char of str) {
    if (char === '(') {
      stack.push(char);
    }
    else if (char === ')') {
      const topItem = stack.shift();
      if (topItem !== '(') {
        return false;
      }
    }
  }
  return true;
}

console.log(balancedParens(str));