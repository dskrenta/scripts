'use strict';

const fs = require('fs');
const { promisify } = require('util');
const fetch = require('node-fetch');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({path: `${__dirname}/../.env`});
}

const writeFileAsync = promisify(fs.writeFile);

const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

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

async function getPage({ 
  givenUrl = null,
  stateCode,
  size = 200,
  page = 0,
  city,
}) {
  try {
    const url = givenUrl ? `https://app.ticketmaster.com${givenUrl}&apikey=${process.env.ticketmasterAPIKey}` : `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&apikey=${process.env.ticketmasterAPIKey}&stateCode=${stateCode}&city=${city}&size=${size}&page=${page}`;
    const apiRes = await fetch(url);
    const json = await apiRes.text();
    const data = JSON.parse(json);
    page = data.page.number;
    console.log(`Url: ${url}, Page: ${page}`);
    await writeFileAsync(`./data/ticketmaster-${city}-${stateCode}-${page}.json`, json);
    if ('next' in data._links) {
      await wait(1000);
      await getPage({ givenUrl: data._links.next.href, city, stateCode });
    }
  }
  catch (error) {
    console.error(error);
  } 
}

async function main() {
  try {
    for (let city of cities) {
      await getPage({
        stateCode: city.stateCode,
        city: city.city
      });
    }
  }
  catch (error) {
    console.error(error);
  }
}

main();