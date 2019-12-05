'use strict';

const c = {
  titles: Array.from(document.querySelectorAll('.le-event-title')).map(node => node.textContent),
  dates: Array.from(document.querySelectorAll('.le-date-time')).map(node => node.textContent),
  descriptions: Array.from(document.querySelectorAll('.le-description')).map(node => node.textContent),
  images: Array.from(document.querySelectorAll('.le-photo > span > a > img')).map(node => node.getAttribute('src')),
  hrefs: Array.from(document.querySelectorAll('.le-event-title > a')).map(node => node.getAttribute('href'))
};

console.log(JSON.stringify(c.titles.map((title, i) => ({ title, date: c.dates[i], image: c.images[i], description: c.descriptions[i], url: c.hrefs[i] })), null, 2))

// Done in 2 console commands
