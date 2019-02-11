'use strict';

const fetch = require('node-fetch');
const fs = require('fs');
const { promisify } = require('util');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({path: `${__dirname}/../.env`});
}

const writeFileAsync = promisify(fs.writeFile);

const DATA_DIR_PATH = './data/';
const PAGE_SIZE = 100000;

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
    city: 'Baltimore',
    citySlug: 'baltimore',
    stateCode: 'MD'
  },
  {
    city: 'Buffalo',
    citySlug: 'buffalo',
    stateCode: 'NY'
  },
  {
    city: 'Charlotte',
    citySlug: 'charlotte',
    stateCode: 'NC'
  },
  {
    city: 'Cincinatti',
    citySlug: 'cincinatti',
    stateCode: 'OH'
  },
  {
    city: 'Cleveland',
    citySlug: 'cleveland',
    stateCode: 'OH'
  },
  {
    city: 'Dallas',
    citySlug: 'dallas',
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
    city: 'pittsburg',
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
    for (let latLon of latLons) {
      console.log(latLon.city);
      const res = await fetch(`https://api.meetup.com/find/upcoming_events?photo-host=public&page=${PAGE_SIZE}&lat=${latLon.lat}&lon=${latLon.lon}&key=${process.env.meetupAPIKey}&sign=true`);
      const text = await res.text();
      await writeFileAsync(`${DATA_DIR_PATH}${latLon.citySlug}.json`, text);
    }
  }
  catch (error) {
    console.error(error);
  }
}

main();