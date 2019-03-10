'use strict';

const fetch = require('node-fetch');
const fs = require('fs');
const { promisify } = require('util');

const DATA_DIR_PATH = './data/';

const writeFileAsync = promisify(fs.writeFile);

const to = 175;
const url = `https://api.theatermania.com/graphql?query=query%20GuidePage(%24filterOpts%3AListingFilterInput!%2C%24featuredLogoRequest%3A%5BImageRequestInput!%5D!%2C%24logoRequest%3A%5BImageRequestInput!%5D!%2C%24market%3AString!%2C%24pagination%3APaginationInput)%7BfindListings(options%3A%24filterOpts%2Cpagination%3A%24pagination)%7Bpagination%7Bfrom%20size%20total%20__typename%7Dlistings%7Bdate_preview%20date_closing%20date_opening%20genres%7Btext%20url_compat%20__typename%7Did%20logo(imageRequest%3A%24logoRequest)%7Balt%20sources%7Bbreakpoint%20height%20path%20path2x%20width%20__typename%7D__typename%7Doffer%7Bdescription%20name%20offered_by%20price%20price_regular%20type%20url%20valid_from%20valid_through%20__typename%7Dreview%20name%20reference%20title%20markets%7Btext%20url_compat%20__typename%7Dvenue%7Bmarkets%7Btext%20url_compat%20__typename%7Dreference%20title%20__typename%7D__typename%7DaggregateData%7BgenreCount%7Bcount%20text%20__typename%7DhasDiscounts%20__typename%7D__typename%7DgetFeaturedListings(market%3A%24market%2CpageType%3A%22guide%22)%7Bfeature_data%7Bend_date%20start_date%20__typename%7Dgenres%7Btext%20url_compat%20__typename%7Dvenue%7Bmarkets%7Btext%20url_compat%20__typename%7Dreference%20title%20__typename%7Ddate_opening%20date_closing%20date_preview%20offer%7Bdescription%20offered_by%20url%20price_regular%20price%20type%20__typename%7Did%20logo(imageRequest%3A%24featuredLogoRequest)%7Balt%20sources%7Bbreakpoint%20height%20path%20path2x%20width%20__typename%7D__typename%7Dmarkets%7Burl_compat%20__typename%7Dreference%20title%20__typename%7D%7D&operationName=GuidePage&variables=%7B%22market%22%3A%22california-theater%22%2C%22filterOpts%22%3A%7B%22market%22%3A%22california-theater%22%2C%22date_filter%22%3A%22all%22%2C%22genres%22%3A%5B%5D%2C%22discount%22%3Afalse%7D%2C%22logoRequest%22%3A%5B%7B%22breakpoint%22%3A%22default%22%2C%22width%22%3A300%2C%22style%22%3A%22logo%22%7D%2C%7B%22breakpoint%22%3A%22(min-width%3A%20481px)%20and%20(max-width%3A%20601px)%22%2C%22width%22%3A275%2C%22style%22%3A%22logo%22%7D%2C%7B%22breakpoint%22%3A%22(min-width%3A%20601px)%20and%20(max-width%3A%20769px)%22%2C%22width%22%3A300%2C%22style%22%3A%22logo%22%7D%2C%7B%22breakpoint%22%3A%22(min-width%3A%201025px)%22%2C%22width%22%3A275%2C%22style%22%3A%22logo%22%7D%5D%2C%22featuredLogoRequest%22%3A%5B%7B%22breakpoint%22%3A%22default%22%2C%22width%22%3A275%2C%22style%22%3A%22logo%22%7D%5D%2C%22pagination%22%3A%7B%22from%22%3A0%2C%22size%22%3A${to}%7D%7D`;


async function main() {
  try {
    console.log(`Fetching: ${url}`);
    const req = await fetch(url);
    const res = await req.json();
    // console.log(res);
    await writeFileAsync(`${DATA_DIR_PATH}theatermania_${0}.json`, JSON.stringify(res));
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
