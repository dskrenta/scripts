'use strict';

const fs = require('fs');
const { promisify } = require('util');

const puppeteer = require('puppeteer');

const DATA_PATH = 'data/';

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

async function main() {
  try {
    const content = await readFileAsync(`${DATA_PATH}urls.json`, 'utf-8');
    const urls = JSON.parse(content);

    const imgUrls = [];

    for (let url of urls) {
      console.log(`Fetching: ${url}`);
      imgUrls.push(await grabRequest(url));
    }

    await writeFileAsync(`${DATA_PATH}imgUrls.json`, JSON.stringify(imgUrls));
  }
  catch (error) {
    console.error(error);
  }
}

main();

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

    const imgUrl = await page.evaluate(() => {
      return `https:${document.querySelector('#comic > img').getAttribute('src')}`;
    });

    await page.close();
    await browser.close();

    return imgUrl;
  }
  catch (error) {
    console.error(error);
  }
}
