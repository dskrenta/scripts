'use strict';

const fetch = require('node-fetch');

async function grab() {
  try {
    const res = await fetch(
      `https://my.factual.com/api/t/places?include_count=t&limit=20&offset=0&filters=%7B%22%24and%22%3A%5B%7B%22country%22%3A%7B%22%24eq%22%3A%22US%22%7D%7D%5D%7D`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept-Language': 'en-US,en;q=0.9,ko;q=0.8,es;q=0.7',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Cookie': '_ga=GA1.2.2021688138.1529120791; _gid=GA1.2.634030007.1529120791; _mkto_trk=id:682-ZHT-104&token:_mch-factual.com-1529120793757-63202; _ceg.s=paed6f; _ceg.u=paed6f; _fsession=cb8a39ae3bc49a8fd7f9f66ee98924c2; CookieConsent=-1; _gat_UA-8499797-10=1; _ceg.s=paedd4; _ceg.u=paedd4',
          'Host': 'my.factual.com',
          'Pragma': 'no-cache',
          'Referer': 'https://my.factual.com/data/t/places',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
          'X-CSRF-Token': 'Jfu0ZBOW2gDZyg0KFtZS7lK8sifTBst7fodgfJfAFKbbhu2L8Oiw/+qxSkuOSTsvFx7EMXzTVuhVqkqu7/uk6w==',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }
    );

    const result = await res.text();

    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
}

grab();