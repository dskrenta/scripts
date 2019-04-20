'use strict';

const puppeteer = require('puppeteer');
const fs = require('fs');
const { promisify } = require('util');

const writeFileAsync = promisify(fs.writeFile);

const MEETUP_URLS_FILE = './meetupsUrls.txt';

function extractMeetups() {
  return Array.from(document.querySelectorAll('.groupCard > div > a.groupCard--photo')).map(node => node.getAttribute('href')).filter(href => href.startsWith('https://www.meetup.com'));
}

async function scrapeInfiniteScrollItems(
  page,
  extractItems,
  itemTargetCount,
  scrollDelay = 1000,
) {
  try {
    let items = [];
    let previousHeight;

    while (itemTargetCount == null || items.length < itemTargetCount) {
      items = await page.evaluate(extractItems);

      console.log(items.length);

      previousHeight = await page.evaluate('document.body.scrollHeight');
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
      await page.waitFor(scrollDelay);
    }
  } catch(e) {
    console.error(e);
  }

  return items;
}


async function main() {
  try {
    const url = 'https://www.meetup.com/find/?allMeetups=true&radius=Infinity&userFreeform=San+Francisco%2C+California%2C+USA&sort=recommended';

    const browser = await puppeteer.launch({
      // headless: false
    });
    const page = await browser.newPage();

    const status = await page.goto(url, {
      waitUntil: ['domcontentloaded', 'load', 'networkidle0']
    });

    if (!status.ok) {
      console.error(`Cannot open ${url}`);
      throw new Error();
    }

    await page.click('span.button.span-100');

    const allItems = await scrapeInfiniteScrollItems(page, extractMeetups);

    await writeFileAsync(MEETUP_URLS_FILE, JSON.stringify(allItems));

    console.log(allItems);

    await page.close();
    await browser.close();
  }
  catch (error) {
    console.error(error);
  }
}

main();
