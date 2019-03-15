'use strict';

const fs = require('fs');
const { promisify } = require('util');

const readDirAsync = promisify(fs.readdir);
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const DATA_DIR = './data/';

function parseEvent(event) {
  return {
    ...event,
    address: event.address ? event.address.replace('undefined', '').trim() : null,
    location: event.location ? { lat: event.location[0], lon: event.location[1] } : null
  };
}

async function main() {
  try {
    const files = await readDirAsync(DATA_DIR);
    const sortedEvents = {};
    for (let file of files) {
      const content = await readFileAsync(`${DATA_DIR}${file}`);
      const events = JSON.parse(content);
      for (let event of events) {
        const generalLoc = event.city ? event.city.split(',')[1].trim() : null;
        if (generalLoc) {
          if (generalLoc in sortedEvents) {
            sortedEvents[generalLoc].push(parseEvent(event));
          }
          else {
            sortedEvents[generalLoc] = [parseEvent(event)];
          }
        }
      }
    }
    console.log(sortedEvents);
    await writeFileAsync(`${DATA_DIR}events.json`, JSON.stringify(sortedEvents));
  }
  catch (error) {
    console.error(error);
  }
}

main();