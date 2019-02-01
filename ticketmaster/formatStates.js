'use strict';

const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const DATA_FILE = 'us_cities_states_counties.csv';

async function main() {
  try {
    const states = new Set();
    const data = await readFileAsync(DATA_FILE, 'utf-8');
    data.split('\n').forEach(line => {
      const values = line.split('|');
      (values[1] && values[1] !== 'State short') && states.add(values[1]);
    });
    console.log(states);
    await writeFileAsync('states.json', JSON.stringify(Array.from(states)));
  }
  catch (error) { 
    console.error(error);
  }
}

main();