'use strict';

const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);

const FILE_NAME = '4.5+shopping.json';

async function topCategoriesFunc() {
  try {
    const topCategories = {};
    const res = await readFileAsync(FILE_NAME, 'utf-8');
    const items = JSON.parse(res);
    for (const item of items) {
      const cats = item.categories ? item.categories.split(',') : [];
      if (item.stars >= 4.5) {
        for (const cat of cats) {
          if (cat in topCategories) {
            topCategories[cat] += 1;
          }
          else {
            topCategories[cat] = 1;
          }
        }
      }
    }
    const sortable = [];
    for (const cat in topCategories) {
      sortable.push([cat, topCategories[cat]]);
    }
    sortable.sort((a, b) => a[1] - b[1]);
    console.log(sortable.reverse());
  }
  catch (error) {
    console.error(error);
  }
}

// topCategoriesFunc();

async function attributesFunc() {
  try {
    const topAttributes = {};
    const res = await readFileAsync(FILE_NAME, 'utf-8');
    const items = JSON.parse(res);
    for (const item of items) {
      const attrs = item.attributes ? item.attributes.match(/'(.+?)'/g).map(str => str.replace(/'/g, '')) : [];
      for (const attr of attrs) {
        if (attr in topAttributes) {
          topAttributes[attr] += 1;
        }
        else {
          topAttributes[attr] = 1;
        }
      }
    }
    const sortable = [];
    for (const attr in topAttributes) {
      sortable.push([attr, topAttributes[attr]]);
    }
    sortable.sort((a, b) => a[1] - b[1]);
    console.log(sortable.reverse());
  }
  catch (error) {
    console.error(error);
  }
}

attributesFunc();
