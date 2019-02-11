'use strict';

const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);

const DATA_DIR_PATH = './data/';

const cities = [
  {
    city: 'boulder',
    stateCode: 'CO'
  },
  {
    city: 'san francisco',
    stateCode: 'CA'
  },
  {
    city: 'new york',
    stateCode: 'NY'
  },
  {
    city: 'los angeles',
    stateCode: 'CA'
  },
  {
    city: 'atlanta',
    stateCode: 'GA'
  },
  {
    city: 'chicago',
    stateCode: 'IL'
  },
  {
    city: 'boston',
    stateCode: 'MA'
  },
  {
    city: 'philadelphia',
    stateCode: 'PA'
  },
  {
    city: 'miami',
    stateCode: 'FL'
  }
];

async function main() {
  try {
    let totalEvents = 0;
    for (let city of cities) {
      const res = await readFileAsync(`${DATA_DIR_PATH}ticketmaster-${city.city}-${city.stateCode}-0.json`, 'utf-8');
      const data = JSON.parse(res);
      console.log(`${city.city}: ${data.page.totalElements}`);
      totalEvents += data.page.totalElements;
    }
    console.log(`Total events: ${totalEvents}`);
  }
  catch (error) {
    console.error(error);
  }
}

main();