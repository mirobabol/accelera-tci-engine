const { chromium } = require('playwright');
const express = require('express');

(async () => {
  const app = express();
  app.use(express.static('dist'));
  const server = app.listen(3000, async () => {
    try {
      const browser = await chromium.launch();
      const page = await browser.newPage();
      page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
      page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
      await page.goto('http://localhost:3000');
      await page.waitForTimeout(2000);
      await browser.close();
    } catch(e) {
      console.log('TEST ERROR:', e);
    }
    server.close();
  });
})();
