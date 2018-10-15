'use strict';

const fetch = require('node-fetch');

async function grab() {
  try {
    const res = await fetch(
      `http://api.v3.factual.com/t/places?filters={"country":"US"}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
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