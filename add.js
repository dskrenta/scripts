'use strict';

const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  host: 'https://search-presearch-wiki-y54jqrsrtnje57wd5ogbpliuiy.us-west-1.es.amazonaws.com',
  log: 'trace'
});

const wikiArticle = {
  title: 'Presearch',
  encodedTitle: 'Presearch',
  snippet: 'Presearch is a search engine based on blockchain technology. The project describes itself as "an open, decentralized search engine that rewards community members with Presearch Tokens for their usage, contribution to, and promotion of the platform."',
  image: 'data:image/jpeg;base64,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',
  url: 'https://en.wikipedia.org/wiki/Presearch_(search_engine)'
};

async function main() {
  try {
    const res = await client.index({
      index: 'wiki',
      id: 'DzsCGmMBd0b5LShnHqlQ',
      type: 'wikiArticle',
      body: wikiArticle
    });

    /*
    const res = await client.search({
      index: 'wiki',
      type: 'wikiArticle',
      q: `title:Presearch`
    });
    */
  }
  catch (error) {
    console.error(error);
  }
}

main();