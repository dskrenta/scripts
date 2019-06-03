'use strict';

const puppeteer = require('puppeteer');

async function main() {
  try {
    for (let i = 1; i <= 5000; i++) {
      await grabPage(i, i === 1);
    }
  }
  catch (error) {
    console.error(error);
  }
}

main();

async function grabPage(pageNum = 1, firstPage = true) {
  try {
    const url = `https://archiveofourown.org/works/search?page=${pageNum}&utf8=%E2%9C%93&work_search%5Bquery%5D=`;

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

    if (firstPage) {
      // Waiting for tos popup
      await wait(2000);

      // Accept tos
      await page.click('#tos_agree');
      await page.click('#accept_tos');
    }

    // Grab desired content
    const data = await page.evaluate(() => {
      const totalResults = document.querySelector('#main > h3.heading').textContent.replace(' Found  ?', '');
      const urls = Array.from(document.querySelectorAll('h4.heading > a')).map(node => node.href).filter(url => url.includes('works'));

      return {
        totalResults,
        urls
      };
    });

    // Log the fruits of our labor
    console.log({ ...data, pageNum });

    await page.close();
    await browser.close();
  }
  catch (error) {
    console.error(error);
  }
}

function wait(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

