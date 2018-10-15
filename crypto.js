'use strict';
const util = require('util');
const fetch = require('node-fetch');

const API_ENDPOINT = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/map';

async function main() {
  try {
    const res = await fetch(API_ENDPOINT, {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'X-CMC_PRO_API_KEY': ''
      }
    });
    const results = await res.json();
    console.log(util.inspect(results, {showHidden: false, depth: null, maxArrayLength: null}));
  }
  catch(error) {
    console.error(error);
  }
}

main();