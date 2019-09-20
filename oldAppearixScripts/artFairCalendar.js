'use strict';

const puppeteer = require('puppeteer');

async function main() {
  try {
    const url = 'https://www.artfaircalendar.com/art_fair/americas-best-art-fairs-the-top-50.html';

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

    /*
    const data = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('.entry-body > p')).filter(node => node.children.length === 1);
      const pickedElements = elements.slice(1, elements.length - 1);
      return pickedElements.map(node => {
        return {
          text: node.textContent,
          url: node.children[0].href
        };
      });
    });
    */

    const data = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.photo-wrap.photo-xid-6a00e54fba8a73883301b8d152019e970c.photo-full > h4, p')).map(node => {
        return node.textContent;
      });
    })

    console.log(data);

    await page.close();
    await browser.close();
  }
  catch (error) {
    console.error(error);
  }
}

main();
