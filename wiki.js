'use strict';

const { promisify } = require('util');
const fs = require('fs');
const elasticsearch = require('elasticsearch');

const readDirAsync = promisify(fs.readdir);
const readFileAsync = promisify(fs.readFile);

const client = new elasticsearch.Client({
  host: '',
  log: 'trace'
});

const SOURCE_PATH = `${__dirname}/../harvix/wikidb`;

async function main() {
  try {
    const wikiFiles = await readDirAsync(SOURCE_PATH);
    const fileContentsPromise = wikiFiles.map(file => readFileAsync(`${SOURCE_PATH}/${file}`, 'utf-8'));
    const fileContents = await Promise.all(fileContentsPromise); 
    const parsedFileContents = fileContents.map(content => content.trim().split('\t'));
    const wikiIndexContents = parsedFileContents.map(content => {
      return {
        title: content[2],
        encodedTitle: content[1],
        snippet: content[3],
        image: content[4],
        url: `http://en.wikipedia.com/wiki/${content[1]}`
      };
    });

    for (let wikiArticle of wikiIndexContents) {
      const res = await client.index({
        index: 'wiki',
        type: 'wikiArticle',
        body: wikiArticle
      });

      if (res.created) {
        console.log(`Successfully indexed: ${wikiArticle.title}`);
      }
      else {
        console.log(`Failed to index: ${wikiArticle.title}`);
      }
    }
  }
  catch (error) {
    console.error(error);
  }
}

main();