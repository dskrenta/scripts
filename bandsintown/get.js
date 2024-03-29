'use strict';

const fetch = require('node-fetch');
const fs = require('fs');
const { promisify } = require('util');

const DATA_DIR_PATH = './data/';

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

const urls = [
  // 'https://www.bandsintown.com/en/upcomingEvents?page=1&longitude=-122.4183333&latitude=37.7750000'
];

for (let location of locations) {
  urls.push(`https://www.bandsintown.com/en/upcomingEvents?page=1&longitude=${location[1]}&latitude=${location[0]}`);
}
 
async function main() {
  try {
    let count = 0;
    for (let url of urls) {
      console.log(`Fetching: ${url}`);
      const req = await fetch(url);
      const res = await req.json();
      // console.log(res);
      if (res.urlForNextPageOfEvents) {
        urls.push(res.urlForNextPageOfEvents)
      }
      await writeFileAsync(`${DATA_DIR_PATH}bandsintown_${count}.json`, JSON.stringify(res));
      count++;
      await wait(1000);
    }
  }
  catch (error) {
    console.error(error);
  }
}

main();

function wait(mills) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, mills)
  });
}
