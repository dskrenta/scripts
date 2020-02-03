'use strict';

const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

async function main() {
  try {
    const fileContent = await readFileAsync('./ny-schools.json', 'utf-8');
    const data = JSON.parse(fileContent);
    /*
    const newData = [];
    for (let record of data) {
      newData.push({
        ...record,
        school: 'fieldston'
      });
    }
    */
    await writeFileAsync('ny-schools.json', JSON.stringify(data, null, 2));
  } 
  catch (error) {
    console.error(error);
  }
}

main();