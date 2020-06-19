const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Log mp4 segments
  page.on('response', response => {
    if (response.url().endsWith('.mp4')) {
      console.log(response)
    }
  });

  // Streaming url
  await page.goto('https://example.com');
  await browser.close();
})();
