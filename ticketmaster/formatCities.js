'use strict';

const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const DATA_FILE = 'us_cities_states_counties.csv';

async function main() {
  try {
    const data = await readFileAsync(DATA_FILE, 'utf-8');
    const cities = {};
    data.split('\n').forEach((item) => {
      const values = item.split('|');
      if (!(values[0] in cities)) {
        cities[values[0]] = {
          city: values[0],
          state: values[2],
          stateCode: values[1]
        }
      }
    });

    console.log(Object.values(cities));
    await writeFileAsync('cities.json', JSON.stringify(Object.values(cities)));
  }
  catch (error) { 
    console.error(error);
  }
}

main();