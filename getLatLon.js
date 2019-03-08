'use strict';

const puppeteer = require('puppeteer');

async function getLatLon(place) {
  try {
    return grabRequest(`https://google.com/search?q=${place}+coordinates`);
  }
  catch (error) {
    console.error(error);
  }
}

function parseLatLon(data) {
  return data.replace('° N', '').replace('° E', '').replace('° S', '').replace('° W', '').split(',').map((str, idx) => idx === 1 ? `-${str.trim()}` : str.trim());
}

async function grabRequest(url) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const status = await page.goto(url, {
      waitUntil: ['domcontentloaded', 'load']
    });

    if (!status.ok) {
      console.error(`Cannot open ${url}`);
      throw new Error();
    }

    const data = await page.evaluate(() => {
      return document.querySelector('.Z0LcW').textContent;
    });

    await page.close();
    await browser.close();

    return parseLatLon(data);
  }
  catch (error) {
    console.error(error);
  }
}

module.exports = getLatLon;
