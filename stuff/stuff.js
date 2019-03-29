'use strict';

function main() {
  const table = {
    'hi': 'Hola',
    'its': 'soy',
    'me': 'yo'
  };

  const str = `Hi, it's me Pachel!`;

  const puncRegex = /\,|\!|\'/g;
  const nextStr = str.replace(puncRegex, '');
  const strs = nextStr.toLowerCase().split(' ');

  let finalStr = '';
  for (let str of strs) {
    finalStr += table[str] ? ` ${table[str]}` : ` ${str}`;
  }
  console.log(finalStr);
}

main();
