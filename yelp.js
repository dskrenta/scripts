'use strict';

const fetch = require('node-fetch');
const cheerio = require('cheerio');

const ZIP_CODE = 94070;

async function main() {
  try {
    const request = await fetch(`https://www.yelp.com/search?find_loc=${ZIP_CODE}`);
    const response = await request.text();
    const $ = cheerio.load(response);
    $('.biz-name').each((index, element) => {
      console.log($(element).attr('href'));
    });
  }
  catch (error) {
    console.error(error);
  }
}

main();

