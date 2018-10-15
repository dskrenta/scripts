'use strict';

const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  host: '',
  log: 'trace'
});

async function createWikiIndex() {
  try {
    await client.indices.create({
      index: 'wiki',
      body: {
        mappings: {
          wikiArticle: {
            properties: {
              title: {type: 'keyword'},
              encodedTitle: {type: 'text'},
              snippet: {type: 'text'},
              image: {type: 'text', index: false},
              url: {type: 'text'}
            }
          }
        }
      }
    });
  }
  catch (error) {
    console.error(error);
  }
}

createWikiIndex();