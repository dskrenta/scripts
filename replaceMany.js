'use strict';

function replaceMany(str, changes) {
  for (let change of changes) {
    str.replace(change[0], change[1]);
  }
  return str;
}
