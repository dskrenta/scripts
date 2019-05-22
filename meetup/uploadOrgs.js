'use strict';

const puppeteer = require('puppeteer');
const elasticsearch = require('elasticsearch');
const fs = require('fs');
const { promisify } = require('util');

const {
  ES_ENDPOINT,
} = require('../../new-app/server/src/utils/constants');
const uploadOrg = require('../../new-app/upload/utils/uploadOrg');
const { dynamicLatLon } = require('../../new-app/upload/utils/getLatLon');
const {
  USERS_INDEX,
  SOURCE_TAGS: { meetup }
} = require('../../new-app/upload/config');

const MEETUP_ORGS_DATA_FILE = './meetupsUrls.txt';

const readFileAsync = promisify(fs.readFile);

const client = new elasticsearch.Client({
  host: ES_ENDPOINT,
  // log: 'trace'
});

async function main() {
  try {
    const getLatLon = await dynamicLatLon();
    const fileContent = await readFileAsync(MEETUP_ORGS_DATA_FILE, 'utf-8');
    const urls = JSON.parse(fileContent);

    for (let url of urls) {
      await grabOrgContent(url, getLatLon);
    }
  }
  catch (error) {
    console.error(error);
  }
}

main();

async function grabOrgContent(url, getLatLon) {
  try {
    const browser = await puppeteer.launch({
      headless: true
    });
    const page = await browser.newPage();

    const status = await page.goto(url, {
      waitUntil: ['domcontentloaded', 'load', 'networkidle0']
    });

    const org = await page.evaluate(() => {
      const nameSelector = document.querySelector('.groupHomeHeader-groupNameLink');
      const imageSelector = document.querySelector('.groupHomeHeader-banner.keepAspect.keepAspect--16-9');
      const bioSelector = document.querySelector('.group-description margin--bottom');
      const locationTextSelector = document.querySelector('.groupHomeHeaderInfo-cityLink');
      const tagsSelector = document.querySelectorAll('.topicsList.flush--left.margin--top > a');

      const name = nameSelector ? nameSelector.textContent : null;
      const profileImage = imageSelector ? imageSelector.style.backgroundImage.replace('url("', '').replace('")', '') : null;

      return {
        name,
        profileImage,
        bio: bioSelector ? bioSelector.textContent : null,
        tags: tagsSelector ? Array.from(tagsSelector).map(node => node.textContent) : [],
        address: locationTextSelector ? locationTextSelector.textContent : null,
      };
    });

    const updatedOrg = {
      ...org,
      tags: [...org.tags, ...meetup],
      location: org.address ? await getLatLon(org.address) : null,
      externalData: {
        source: 'meetup',
        id: url.replace('https://www.meetup.com/', '').replace('/', '')
      },
      urls: [
        {
          title: org.name,
          image: org.profileImage,
          url
        }
      ]
    };

    // console.log(updatedOrg);

    const uploadRes = await uploadOrg({
      esClient: client,
      index: USERS_INDEX,
      name: updatedOrg.name,
      profileImage: updatedOrg.profileImage,
      bio: updatedOrg.bio,
      tags: updatedOrg.tags,
      externalData: updatedOrg.externalData,
      location: updatedOrg.location,
      address: updatedOrg.address,
      urls: updatedOrg.urls
    });

    uploadRes.uploaded ? console.log(`Uploaded ${updatedOrg.name}`) : console.log(`Failed to upload ${updatedOrg.name}`);

    await page.close();
    await browser.close();
  }
  catch (error) {
    console.error(error);
  }
}
