'use strict';

const fs = require('fs');
const { promisify } = require('util');

const TECHMEME_DATA_PATH = './data/events.json';

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

async function main() {
  try {
    const updatedEvents = [];
    const data = await readFileAsync(TECHMEME_DATA_PATH, 'utf-8');
    const events = await JSON.parse(data);
    for (let event of events) {
      console.log(event.title);
      event.location ? {
        lat: event.location.lat.replace('° S', ''),
        lon: event.location.lon.replace('° E', '')
      } : null;
      updatedEvents.push(event);
    }
    await writeFileAsync(TECHMEME_DATA_PATH, JSON.stringify(updatedEvents));
  }
  catch (error) {
    console.error(error);
  }
}

main();

/*
lat: event.location.lat.replace('° S', ''),
          lon: event.location.lon.replace('° E', '')
*/
