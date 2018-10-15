'use strict';
const fs = require('fs')
const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function main() {
  try {
    const recipes = [];

    for (let i = 0; i < 20; i++) {
      await grabPage(i, recipes);
    }

    const fd = fs.openSync('recipes.txt', 'w');
    for (let recipe of recipes) {
      fs.appendFileSync(fd, `${recipe}\n`, 'utf8');
    }
  }
  catch (error) {
    console.error(error);
  }
}

async function grabPage(num, recipes) {
  try {
    const req = await fetch(`https://www.thewholesomedish.com/category/all-recipes/page/${num}/`);
    const text = await req.text();

    const $ = cheerio.load(text);

    $('.entry-image-link').each((i, elem) => {
      recipes.push($(elem).attr('href'));
    });
  }
  catch (error) {
    console.error(error);
  }
}

async function grabRecipe(recipe) {
  try {
    const req = await fetch(recipe);
    const text = await req.text();

    const $ = cheerio.load(text);

    console.log($('.wprm-recipe-name').val());
  } 
  catch (error) {
    console.error(error);
  }
}

// main();

grabRecipe('https://www.thewholesomedish.com/the-best-classic-meatloaf/');