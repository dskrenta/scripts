'use strict';

const fs = require('fs');
const { promisify } = require('util');

const DATA_PATH = './data/finalEvents/';
const TAGS_DATA_PATH = './data/tags.txt';

const readDirAsync = promisify(fs.readdir);
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const tags = {};

function addTag(tag) {
  if (tag in tags) {
    tags[tag] += 1;
  }
  else {
    tags[tag] = 1;
  }
}

async function main() {
  try {
    const files = await readDirAsync(DATA_PATH);
    for (let file of files) {
      const data = await readFileAsync(`${DATA_PATH}${file}`);
      const content = JSON.parse(data);
      for (let event of content) {
        for (let tag of event.tags) {
          addTag(tag);
        }
      }
    }
    const keysSorted = Object.keys(tags).sort((a, b) => tags[a] - tags[b]);
    const tagsOutput = keysSorted.map(key => `${key}: ${tags[key]}`).join('\n');
    await writeFileAsync(TAGS_DATA_PATH, tagsOutput);
  }
  catch (error) {
    console.error(error);
  }
}

main();
