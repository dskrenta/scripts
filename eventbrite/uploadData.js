'use strict';

const fs = require('graceful-fs');
const { promisify } = require('util');

const EVENTS_DATA_DIR_PATH = './data/events/';
const PARSED_EVENTS_DATA_DIR_PATH = './data/parsedEvents/';

const readDirAsync = promisify(fs.readdir);
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

async function parseFile(file) {
  try {
    const events = [];
    const fileData = await readFileAsync(`${EVENTS_DATA_DIR_PATH}${file}`, 'utf-8');
    const fileObj = JSON.parse(fileData);
    for (let value of fileObj) {
      const tags = [];

      if ('format' in value && value.format !== null) {
        tags.push(value.format.short_name);
      }

      if ('category' in value && value.category !== null) {
        tags.push(value.category.short_name);
      }

      events.push({
        id: value.id,
        title: value.name.text,
        eventTimestampStart: value.start.utc,
        image: 'logo' in value ? value.logo.url : null,
        hostId: value.organizer.id,
        host: {
          id: value.organizer.id,
          profileImage: 'logo' in value.organizer ? value.organizer.logo.url : null,
          name: value.organizer.name,
          isOrganization: true,
          externalData: {
            source: 'eventbrite',
            id: value.organizer.id
          },
          urls: [
            {
              url: value.organizer.url
            }
          ]
        },
        isOrganization: true,
        location: 'address' in value ? {
          lat: value.address.latitude,
          lon: value.address.latitude
        } : null,
        address: 'address' in value ? value.address.localized_address_display : null,
        venueName: value.venue.name,
        externalData: {
          source: 'eventbrite',
          id: value.id
        },
        urls: [
          {
            url: value.url
          }
        ],
        tags
      });
    }

    console.log(file);
    await writeFileAsync(`${PARSED_EVENTS_DATA_DIR_PATH}${file}`, JSON.stringify(events));
  }
  catch (error) {
    console.log(`Error file: ${file}`);
    console.error(error);
  }
}

async function main() {
  try {
    const files = await readDirAsync(EVENTS_DATA_DIR_PATH);
    for (let file of files) {
      await parseFile(file);
    }
  }
  catch (error) {
    console.error(error);
  }
}

main();