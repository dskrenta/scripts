'use strict';

const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);

const DATA_DIR_PATH = './data/';

const latLons = [
  /*
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
  */
  {
    lat: '39.2904',
    lon: '-76.6122',
    city: 'Baltimore',
    citySlug: 'baltimore',
    stateCode: 'MD'
  },
  {
    lat: '42.8864',
    lon: '-78.8784',
    city: 'Buffalo',
    citySlug: 'buffalo',
    stateCode: 'NY'
  },
  {
    lat: '35.2271',
    lon: '-80.8431',
    city: 'Charlotte',
    citySlug: 'charlotte',
    stateCode: 'NC'
  },
  {
    lat: '39.1031',
    lon: '-84.5120',
    city: 'Cincinnati',
    citySlug: 'cincinnati',
    stateCode: 'OH'
  },
  {
    lat: '41.4993',
    lon: '-81.6944',
    city: 'Cleveland',
    citySlug: 'cleveland',
    stateCode: 'OH'
  },
  {
    lat: '32.7767',
    lon: '-96.7970',
    city: 'Dallas',
    citySlug: 'dallas',
    stateCode: 'TX'
  },
  {
    lat: '39.7392',
    lon: '-104.9903',
    city: 'Denver',
    citySlug: 'denver',
    stateCode: 'CO'
  },
  {
    lat: '39.7392',
    lon: '-104.9903',
    city: 'Detroit',
    citySlug: 'detroit',
    stateCode: 'MI'
  },
  {
    lat: '39.7684',
    lon: '-86.1581',
    city: 'Indianapolis',
    citySlug: 'indianapolis',
    stateCode: 'IN'
  },
  {
    lat: '30.3322',
    lon: '-81.6557',
    city: 'jacksonville',
    citySlug: 'jacksonville',
    stateCode: 'FL'
  },
  {
    lat: '39.0997',
    lon: '-94.5786',
    city: 'Kansas City',
    citySlug: 'kansas-city',
    stateCode: 'MO'
  },
  {
    lat: '39.0997',
    lon: '-94.5786',
    city: 'Green Bay',
    citySlug: 'green-bay',
    stateCode: 'WI'
  },
  {
    lat: '44.9778',
    lon: '-93.2650',
    city: 'Minneapolis',
    citySlug: 'minneapolis',
    stateCode: 'MN'
  },
  {
    lat: '36.1627',
    lon: '-86.7816',
    city: 'Nashville',
    citySlug: 'nashville',
    stateCode: 'TN'
  },
  {
    lat: '29.9511',
    lon: '-90.0715',
    city: 'New Orleans',
    citySlug: 'new-orleans',
    stateCode: 'LA'
  },
  {
    lat: '34.8044',
    lon: '-122.2711',
    city: 'Oakland',
    citySlug: 'oakland',
    stateCode: 'CA'
  },
  {
    lat: '33.4484',
    lon: '-112.0740',
    city: 'Phoenix',
    citySlug: 'phoenix',
    stateCode: 'AZ'
  },
  {
    lat: '40.4406',
    lon: '-79.9959',
    city: 'Pittsburgh',
    citySlug: 'pittsburgh',
    stateCode: 'PA'
  },
  {
    lat: '38.6270',
    lon: '-90.1994',
    city: 'St Louis',
    citySlug: 'st-louis',
    stateCode: 'MO'
  },
  {
    lat: '32.7157',
    lon: '-117.1611',
    city: 'San Diego',
    citySlug: 'san-diego',
    stateCode: 'CA'
  },
  {
    lat: '47.6062',
    lon: '-122.3321',
    city: 'Seattle',
    citySlug: 'seattle',
    stateCode: 'WA'
  },
  {
    lat: '27.9506',
    lon: '-82.4574',
    city: 'Tampa',
    citySlug: 'tampa',
    stateCode: 'fl'
  },
  {
    lat: '29.7604',
    lon: '-95.3698',
    city: 'Houston',
    citySlug: 'houston',
    stateCode: 'TX'
  },
  {
    lat: '33.4942',
    lon: '-111.9261',
    city: 'Scottsdale',
    citySlug: 'scottsdale',
    stateCode: 'AZ'
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