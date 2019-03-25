'use strict';

const fs = require('fs');
const { promisify } = require('util');
const fetch = require('node-fetch');

const EVENTS_DATA_FILE_PATH = './data/';
const HITS_PER_PAGE = 100;

const writeFileAsync = promisify(fs.writeFile);

const locations = [
  [ '35.0844', '-106.6504' ],
  [ '42.2808', '-83.7430' ],
  [ '39.0438', '-77.4874' ],
  [ '33.7490', '-84.3880' ],
  [ '30.2672', '-97.7431' ],
  [ '39.2904', '-76.6122' ],
  [ '45.4888', '-122.8013' ],
  [ '47.6101', '-122.2015' ],
  [ '52.4862', '-1.8904' ],
  [ '42.3601', '-71.0589' ],
  [ '41.8781', '-87.6298' ],
  [ '39.1031', '-84.5120' ],
  [ '39.9612', '-82.9988' ],
  [ '32.7767', '-96.7970' ],
  [ '39.7392', '-104.9903' ],
  [ '42.3314', '-83.0458' ],
  [ '32.7555', '-97.3308' ],
  [ '21.3069', '-157.8583' ],
  [ '29.7604', '-95.3698' ],
  [ '39.7684', '-86.1581' ],
  [ '40.7178', '-74.0431' ],
  [ '39.0997', '-94.5786' ],
  [ '47.6769', '-122.2060' ],
  [ '36.1699', '-115.1398' ],
  [ '34.0522', '-118.2437' ],
  [ '38.2527', '-85.7585' ],
  [ '35.1495', '-90.0490' ],
  [ '25.7617', '-80.1918' ],
  [ '43.0389', '-87.9065' ],
  [ '44.9778', '-93.2650' ],
  [ '36.1627', '-86.7816' ],
  [ '29.9511', '-90.0715' ],
  [ '40.7128', '-74.0060' ],
  [ '37.8044', '-122.2711' ],
  [ '35.4676', '-97.5164' ],
  [ '41.2565', '-95.9345' ],
  [ '33.7175', '-117.8311' ],
  [ '28.5383', '-81.3792' ],
  [ '39.9526', '-75.1652' ],
  [ '33.4484', '-112.0740' ],
  [ '40.4406', '-79.9959' ],
  [ '45.5122', '-122.6587' ],
  [ '41.8240', '-71.4128' ],
  [ '35.7796', '-78.6382' ],
  [ '38.5816', '-121.4944' ],
  [ '38.6270', '-90.1994' ],
  [ '40.7608', '-111.8910' ],
  [ '29.4241', '-98.4936' ],
  [ '32.7157', '-117.1611' ],
  [ '37.7749', '-122.4194' ],
  [ '37.3382', '-121.8863' ],
  [ '38.4404', '-122.7141' ],
  [ '47.6062', '-122.3321' ],
  [ '47.2529', '-122.4443' ],
  [ '27.9506', '-82.4572' ],
  [ '38.9072', '-77.0369' ]
];

const places = ["Albuquerque", "Ann Arbor", "Ashburn", "Atlanta", "Austin", "Baltimore", "Beaverton", "Bellevue", "Birmingham", "Boston", "Chicago", "Cincinnati", "Columbus", "Dallas", "Denver", "Detroit", "Fort Worth", "Honolulu", "Houston", "Indianapolis", "Jersey City", "Kansas City", "Kirkland", "Las Vegas", "Los Angeles", "Louisville", "Memphis", "Miami", "Milwaukee", "Minneapolis", "Nashville", "New Orleans", "New York", "Oakland", "Oklahoma City", "Omaha", "Orange County", "Orlando", "Philadelphia", "Phoenix", "Pittsburgh", "Portland", "Providence", "Raleigh", "Sacramento", "Saint Louis", "Salt Lake City", "San Antonio", "San Diego", "San Francisco", "San Jose", "Santa Rosa", "Seattle", "Tacoma", "Tampa", "Washington DC"];

function wait(mills) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, mills)
  });
}

async function main() {
  try {
    let count = 0;
    for (let location of locations) {
      console.log(location, places[count]);
      const res = await buildRequest(`${location.join(',')}`, HITS_PER_PAGE);
      console.log(res);
      await writeFileAsync(`${EVENTS_DATA_FILE_PATH}${places[count]}.json`, res);
      await wait(5000);
      count++;
    }
  }
  catch (error) {
    console.error(error);
  }
}

async function buildRequest(latLon, hitsPerPage) {
  try {
    const body = {
      aroundLatLng: latLon,
      aroundRadius: 60000,
      filters: 'status_overall:approved AND search = 1 AND event_date >= 1552028400000',
      hitsPerPage,
      page: 1
    };

    const res = await fetch(`https://40b2x68xjr-dsn.algolia.net/1/indexes/production-calendar-events/query?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.32.0&x-algolia-application-id=40B2X68XJR&x-algolia-api-key=1f536bd6d4315a784b4d6c1046e6df8e`, {
      method: 'post',
      body: JSON.stringify(body),
    });

    return res.text();
  }
  catch (error) {
    console.error(error);
  }
}

main();
