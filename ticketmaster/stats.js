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
  },
  {
    city: 'baltimore',
    stateCode: 'MD'
  },
  {
    city: 'buffalo',
    stateCode: 'NY'
  },
  {
    city: 'charlotte',
    stateCode: 'NC'
  },
  {
    city: 'cincinnati',
    stateCode: 'OH'
  },
  {
    city: 'cleveland',
    stateCode: 'OH'
  },
  {
    city: 'dallas',
    stateCode: 'TX'
  },
  {
    city: 'denver',
    stateCode: 'CO'
  },
  {
    city: 'detroit',
    stateCode: 'MI'
  },
  {
    city: 'indianapolis',
    stateCode: 'IN'
  },
  {
    city: 'jacksonville',
    stateCode: 'FL'
  },
  {
    city: 'kansas city',
    stateCode: 'MO'
  },
  {
    city: 'green bay',
    stateCode: 'WI'
  },
  {
    city: 'minneapolis',
    stateCode: 'MN'
  },
  {
    city: 'nashville',
    stateCode: 'TN'
  },
  {
    city: 'new orleans',
    stateCode: 'LA'
  },
  {
    city: 'oakland',
    stateCode: 'CA'
  },
  {
    city: 'phoenix',
    stateCode: 'AZ'
  },
  {
    city: 'pittsburgh',
    stateCode: 'PA'
  },
  {
    city: 'st louis',
    stateCode: 'MO'
  },
  {
    city: 'san diego',
    stateCode: 'CA'
  },
  {
    city: 'seattle',
    stateCode: 'WA'
  },
  {
    city: 'tampa',
    stateCode: 'fl'
  },
  {
    city: 'houston',
    stateCode: 'TX'
  },
  {
    city: 'washington',
    stateCode: 'DC'
  },
  {
    city: 'scottsdale',
    stateCode: 'AZ'
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