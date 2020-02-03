'use strict';

const puppeteer = require('puppeteer');

const highSchool = ["1987", "1973", "32072", "1967", "19153", "1989", "1975", "24769", "24770", "4604", "14857", "1968", "1969", "4596", "1972", "1971", "19095", "1974", "1966", "1970", "20409", "4586", "24604", "20407", "34422", "31901", "4591", "4593", "4594", "20260"];
const middleSchool = ["14858", "32072", "19885", "1983", "1977", "25292", "22656", "24771", "1999", "4603", "1978", "4596", "1979", "1982", "1981", "19095", "1985", "1984", "4555", "1980", "20409", "4586", "24604", "20407", "31901", "4591", "4592", "4594", "4595", "4597", "20260"];

async function main() {
  try {
    // for (let id of [...highSchool, ...middleSchool]) {
      let id = '1987';
      await grabPage(`https://www.dalton.org/contact/faculty--staff-directory?deptId=${id}`);
    // }
  }
  catch (error) {
    conslele.error(error);
  }
}

async function grabPage(url) {
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

    const data = await page.evaluate(() => {
      return null;
    });
  }
  catch (error) {
    console.error(error);
  }
}

main();