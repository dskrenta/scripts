'use strict';

const puppeteer = require('puppeteer');

const EXCLUDE_STRING = 'January |  February |  March |  April |  May |  June |  July |  August |  September |  October |  November |  December';

async function main() {
  try {
    const url = 'http://www.foodreference.com/html/january-2019-food-festivals.html';

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

    const data = await page.evaluate((EXCLUDE_STRING) => {
      return Array.from(document.querySelectorAll('.TextObject > p')).filter(node => node.textContent.startsWith('Jan') && !node.textContent.includes(EXCLUDE_STRING)).map(node => {
        return {
          text: node.textContent,
          title: node.children[0].textContent
        };
      });
    }, EXCLUDE_STRING);

    console.log(data);

    await page.close();
    await browser.close();
  }
  catch (error) {
    console.error(error);
  }
}

main();
