const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 Starting E2E Test: Training Hub Tabs Interactions...');
  
  // Launch browser in headful mode
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 120, // delayed so the user can easily see tabs switching
    defaultViewport: null,
    args: ['--start-maximized', '--window-size=1280,800']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  try {
    console.log('🔗 Navigating to IDEASJENERATION Landing Page...');
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.training-hub-container', { timeout: 10000 });
    await sleep(1000);

    console.log('📜 Scrolling to Training Pillars Hub Section...');
    const container = await page.$('.training-hub-container');
    await container.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
    await sleep(2000); // Wait for scroll animation

    // Verify Tab 1 is active on load
    console.log('🔍 Checking if Pillar 1 (Marketing & Brand Growth Strategy) is active on load...');
    const p1Active = await page.$('.training-pillar-panel#pillar-1.active');
    if (p1Active) {
      console.log('✅ Pillar 1 is active by default!');
    }
    await sleep(1500);

    // Click Tab 2
    console.log('🖱️ Clicking on Tab 2: Consumer Insight, Data Mining & Intelligence...');
    const tab2Btn = await page.$('.training-tabs-sidebar button:nth-child(2)');
    await tab2Btn.click();
    await page.waitForSelector('.training-pillar-panel#pillar-2.active', { timeout: 3000 });
    console.log('✅ Pillar 2 Content is now visible!');
    await sleep(2500); // Let user view

    // Click Tab 3
    console.log('🖱️ Clicking on Tab 3: Digital, TikTok & Modern Consumer Marketing...');
    const tab3Btn = await page.$('.training-tabs-sidebar button:nth-child(3)');
    await tab3Btn.click();
    await page.waitForSelector('.training-pillar-panel#pillar-3.active', { timeout: 3000 });
    console.log('✅ Pillar 3 Content is now visible!');
    await sleep(2500);

    // Click Tab 5
    console.log('🖱️ Clicking on Tab 5: Business Strategy, Finance & Risk Thinking...');
    const tab5Btn = await page.$('.training-tabs-sidebar button:nth-child(5)');
    await tab5Btn.click();
    await page.waitForSelector('.training-pillar-panel#pillar-5.active', { timeout: 3000 });
    console.log('✅ Pillar 5 Content is now visible!');
    await sleep(2500);

    // Click Tab 6
    console.log('🖱️ Clicking on Tab 6: Customized Corporate Training...');
    const tab6Btn = await page.$('.training-tabs-sidebar button:nth-child(6)');
    await tab6Btn.click();
    await page.waitForSelector('.training-pillar-panel#pillar-6.active', { timeout: 3000 });
    console.log('✅ Pillar 6 Content is now visible!');
    await sleep(2500);

    console.log('🎉 E2E Test: Training Hub Tabs Interactions completed successfully!');
  } catch (error) {
    console.error('❌ E2E Test Failed with error:', error);
  } finally {
    await browser.close();
  }
})();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
