'use strict';

const fs = require('fs');
const { promisify } = require('util');

const puppeteer = require('puppeteer');

const DATA_PATH = 'data/';

const writeFileAsync = promisify(fs.writeFile);

async function grabRequest(url) {
  try {
    const browser = await puppeteer.launch({
      headless: true
    });
    const page = await browser.newPage();

    const status = await page.goto(url, {
      waitUntil: ['domcontentloaded', 'load', 'networkidle0']
    });

    if (!status.ok) {
      console.error(`Cannot open ${url}`);
      throw new Error();
    }

    const urls = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#middleContainer > a')).map(node => `https://xkcd.com${node.getAttribute('href')}`);
    });

    await writeFileAsync(`${DATA_PATH}urls.json`, JSON.stringify(urls));

    await page.close();
    await browser.close();
  }
  catch (error) {
    console.error(error);
  }
}

grabRequest('https://xkcd.com/archive/');
