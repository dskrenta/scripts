'use strict';

const fs = require('fs');
const { promisify } = require('util');
const fetch = require('node-fetch');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({path: `${__dirname}/../.env`});
}

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

const CITIES_FILE = 'cities.json';

const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

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
    const data = JSON.parse(data);
    page = data.page.number;
    console.log(`Url: ${url}, Page: ${page}`);
    await writeFileAsync(`./data/ticketmaster-${city}-${stateCode}-${page}.json`, json);
    if ('next' in data._links) {
      await wait(1000);
      await getPage({ givenUrl: data._links.next.href });
    }
  }
  catch (error) {
    console.error(error);
  } 
}

async function main() {
  try {
    const citiesData = await readFileAsync(CITIES_FILE, 'utf-8');
    const cities = JSON.parse(citiesData);
    for (let cityData of cities) {
      await getPage({
        stateCode = cityData.stateCode,
        city: cityData.city
      });
    }
  }
  catch (error) {
    console.error(error);
  }
}

main();