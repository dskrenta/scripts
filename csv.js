'use strict';

const fs = require('fs');
const fsAsync = fs.promises;

async function main() {
  try {
    let out = '';
    let out2 = '';
    let index = 1;
    let index2 = 1;

    const csvData = await fsAsync.readFile('/home/david/Documents/ner_dataset.csv', 'utf-8');
    const data = csvData.split('\n');
    for (let line of data) {
      const values = line.split(',');

      if (values[1] !== '"' && values[3]) {
        let tag = values[3];
        tag = tag.replace('-tim', '');
        tag = tag.replace('-org', '');
        tag = tag.replace('-gpe', '');
        tag = tag.replace('-geo', '');
        tag = tag.replace('-per', '');

        console.log(values[1], tag);
        if (index < 1000) {
          out += `${index}\t${values[1]}\t${tag}`;
          index++;
        }
        else {
          out2 += `${index2}\t${values[1]}\t${tag}`;
          index2++;
        }
      }
    }

    console.log('Writing files...');
    fsAsync.writeFile('out.txt', out, 'utf-8');
    fsAsync.writeFile('out2.txt', out2, 'utf-8');
  }
  catch (error) {
    console.error('main error', error);
  }
}

main();
