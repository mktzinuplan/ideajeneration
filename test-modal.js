const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 Starting E2E Test: Modals Interactions...');
  
  // Launch browser in headful mode (headless: false)
  const browser = await browserLauncher();
  const page = await browser.newPage();
  
  // Set viewport for desktop view
  await page.setViewport({ width: 1280, height: 800 });

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.services-grid', { timeout: 10000 });
    await sleep(1000);

    console.log('🖱️ Clicking on Marketing & Brand Consulting Service card link...');
    // Click the first card details link
    const consultingLink = await page.$('.services-grid .service-card:nth-child(1) .sc-cta-link');
    await consultingLink.click();
    
    console.log('⏳ Waiting for Consulting Modal to open...');
    await page.waitForSelector('#consultingModal.active', { visible: true, timeout: 5000 });
    console.log('✅ Consulting Modal is open!');
    await sleep(2500); // Wait so user can see

    console.log('❌ Clicking the close button...');
    const closeBtn = await page.$('#consultingModal .modal-close-btn');
    await closeBtn.click();

    console.log('⏳ Waiting for Consulting Modal to close...');
    await page.waitForSelector('#consultingModal.active', { hidden: true, timeout: 5000 });
    console.log('✅ Consulting Modal is closed!');
    await sleep(1500);

    console.log('🖱️ Clicking on Data Mining & Marketing Analysis Service card link...');
    const miningLink = await page.$('.services-grid .service-card:nth-child(2) .sc-cta-link');
    await miningLink.click();

    console.log('⏳ Waiting for Data Mining Modal to open...');
    await page.waitForSelector('#miningModal.active', { visible: true, timeout: 5000 });
    console.log('✅ Data Mining Modal is open!');
    await sleep(2500);

    console.log('❌ Clicking the close button in modal footer...');
    const closeFooterBtn = await page.$('#miningModal .modal-footer button');
    await closeFooterBtn.click();

    console.log('⏳ Waiting for Data Mining Modal to close...');
    await page.waitForSelector('#miningModal.active', { hidden: true, timeout: 5000 });
    console.log('✅ Data Mining Modal is closed!');
    await sleep(1500);

    console.log('🎉 E2E Test: Modals Interactions completed successfully!');
  } catch (error) {
    console.error('❌ E2E Test Failed with error:', error);
  } finally {
    await browser.close();
  }
})();

// Helper function to launch browser with custom flags
async function browserLauncher() {
  return await puppeteer.launch({
    headless: false, // Disables headless mode so browser opens
    slowMo: 100,     // Introduces 100ms delay between actions so user can follow
    defaultViewport: null,
    args: ['--start-maximized', '--window-size=1280,800']
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
