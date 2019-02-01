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

async function get({ url }) {
  try {
    const apiRes = await fetch(url);
    const json = await apiRes.json();
    console.log(json);
  }
  catch (error) {
    console.error(error);
  } 
}

get({ url: `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&apikey=${process.env.ticketmasterAPIKey}&stateCode=CA&size=200` });