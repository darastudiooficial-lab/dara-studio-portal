const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('PAGE ERROR:', msg.text());
    } else {
      console.log('LOG:', msg.text());
    }
  });

  page.on('pageerror', err => {
    console.log('PAGE EXCEPTION:', err.toString());
  });

  await page.goto('http://localhost:5173/login?portal=client');
  await new Promise(r => setTimeout(r, 1000));
  
  // Try to click Google login
  try {
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.innerText.includes('Google') || b.innerText.includes('google'));
      if (btn) btn.click();
    });
  } catch(e) {
    console.log(e);
  }

  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
