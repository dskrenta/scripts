'use strict';

const fs = require('fs');
const { promisify, inspect } = require('util');

const readFileAsync = promisify(fs.readFile);
const readDirAsync = promisify(fs.readdir);
const writeFileAsync = promisify(fs.writeFile);

const DATA_DIR = './data/';

async function main() {
  try {
    const files = await readDirAsync(DATA_DIR);
    for (let file of files) {
      const content = await readFileAsync(`${DATA_DIR}${file}`);
      const json = JSON.parse(content);
      const events = json.data.findListings.listings;
      for (let parsedEvent of events) {
        const event = {
          title: parsedEvent.title,
          eventTimestampStart: parsedEvent.date_opening,
          image: parsedEvent.logo ? `https://www.theatermania.com${parsedEvent.logo.sources[0].path}` : null,
          tags: [
            ...parsedEvent.genres.map(val => val.text),
            'Concert',
            'Entertainment',
            'Fun'
          ],
          city: parsedEvent.venue.markets[0].text,
          venueName: parsedEvent.venue.markets[0].text,
          externalData: {
            id: parsedEvent.id,
            source: 'theatermania'
          },
          urls: [
            {
              url: `https://www.theatermania.com/shows/${parsedEvent.venue.markets[0].url_compat}/${parsedEvent.title.toLowerCase().split(' ').join('-')}_${parsedEvent.id}`
            }
          ]
        };
        console.log(event);
      }
    }
  }
  catch (error) {
    console.error(error);
  }
}

main();

/*
{ date_preview: null,
  date_closing: '2019-03-31T00:00:00-04:00',
  date_opening: '2019-03-21T00:00:00-04:00',
  genres:
   [ { text: 'Drama', url_compat: 'drama', __typename: 'Genre' },
     { text: 'Play', url_compat: 'play', __typename: 'Genre' } ],
  id: 328005,
  logo:
   { alt: 'ada-and-the-engine-logo logo image',
     sources:
      [ { breakpoint: 'default',
          height: 200,
          path:
           '/dyn/graphics/theatermania/v1w300/ada-and-the-engine-logo-82907.jpeg',
          path2x:
           '/dyn/graphics/theatermania/v1w600/ada-and-the-engine-logo-82907.jpeg',
          width: 300,
          __typename: 'ImageSource' },
        { breakpoint: '(min-width: 481px) and (max-width: 601px)',
          height: 183.33333333333331,
          path:
           '/dyn/graphics/theatermania/v1w275/ada-and-the-engine-logo-82907.jpeg',
          path2x:
           '/dyn/graphics/theatermania/v1w550/ada-and-the-engine-logo-82907.jpeg',
          width: 275,
          __typename: 'ImageSource' },
        { breakpoint: '(min-width: 601px) and (max-width: 769px)',
          height: 200,
          path:
           '/dyn/graphics/theatermania/v1w300/ada-and-the-engine-logo-82907.jpeg',
          path2x:
           '/dyn/graphics/theatermania/v1w600/ada-and-the-engine-logo-82907.jpeg',
          width: 300,
          __typename: 'ImageSource' },
        { breakpoint: '(min-width: 1025px)',
          height: 183.33333333333331,
          path:
           '/dyn/graphics/theatermania/v1w275/ada-and-the-engine-logo-82907.jpeg',
          path2x:
           '/dyn/graphics/theatermania/v1w550/ada-and-the-engine-logo-82907.jpeg',
          width: 275,
          __typename: 'ImageSource' } ],
     __typename: 'Image' },
  offer:
   [ { description: null,
       name: null,
       offered_by: 'other',
       price: '$20',
       price_regular: null,
       type: 'full_price',
       url:
        'http://www.theatreunleashed.org/production/ada-and-the-engine/',
       valid_from: null,
       valid_through: null,
       __typename: 'Offer' } ],
  review: null,
  name: null,
  reference: 'ada-and-the-engine_328005',
  title: 'Ada and the Engine',
  markets:
   [ { text: 'California',
       url_compat: 'california-theater',
       __typename: 'Market' },
     { text: 'Los Angeles',
       url_compat: 'los-angeles-theater',
       __typename: 'Market' } ],
  venue:
   { markets:
      [ { text: 'Los Angeles',
          url_compat: 'los-angeles-theater',
          __typename: 'Market' } ],
     reference: 'studiostage_4299',
     title: 'Studio/Stage',
     __typename: 'Venue' },
  __typename: 'Listing' }
*/