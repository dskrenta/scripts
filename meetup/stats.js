'use strict';

const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);

const DATA_DIR_PATH = './data/';

const latLons = [
  {
    lat: '40.05',
    lon: '-105.21',
    city: 'Boulder',
    citySlug: 'boulder'
  },
  {
    lat: '37.7749',
    lon: '-122.4194',
    city: 'San Francisco',
    citySlug: 'san-francisco'
  },
  {
    lat: '40.7128',
    lon: '-74.0060',
    city: 'New York',
    citySlug: 'new-york'
  },
  {
    lat: '34.0522',
    lon: '-118.2437',
    city: 'Los Angeles',
    citySlug: 'los-angeles'
  },
  {
    lat: '38.9072',
    lon: '-77.0369',
    city: 'Washington DC',
    citySlug: 'washington-dc'
  },
  {
    lat: '33.7491',
    lon: '-84.3902',
    city: 'Atlanta',
    citySlug: 'atlanta'
  },
  {
    lat: '41.8756',
    lon: '-87.6244',
    city: 'Chicago',
    citySlug: 'chicago'
  },
  {
    lat: '42.3605',
    lon: '-71.0596',
    city: 'Boston',
    citySlug: 'boston'
  },
  {
    lat: '39.9526',
    lon: '-75.1652',
    city: 'Philadelphia',
    citySlug: 'philadelphia'
  },
  {
    lat: '27.7617',
    lon: '-80.1918',
    city: 'Miami',
    citySlug: 'miami'
  }
];

async function main() {
  try {
    let totalEvents = 0;
    for (let city of latLons) {
      const res = await readFileAsync(`${DATA_DIR_PATH}${city.citySlug}.json`, 'utf-8');
      const data = JSON.parse(res);
      console.log(`${city.city}: ${data.events.length}`);
      totalEvents += data.events.length;
    }
    console.log(`Total events: ${totalEvents}`);
  }
  catch (error) {
    console.error(error);
  }
}

main();