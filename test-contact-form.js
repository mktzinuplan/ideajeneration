const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 Starting E2E Test: Contact Form Submission...');
  
  // Launch browser in headful mode
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 120, // slightly slower so user can see text typing
    defaultViewport: null,
    args: ['--start-maximized', '--window-size=1280,800']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#contact', { timeout: 10000 });
    await sleep(1000);

    console.log('📜 Scrolling down to Contact Form Section...');
    await page.evaluate(() => {
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    await sleep(2000); // Wait for scroll animation

    // Fill Form inputs
    console.log('✍️ Typing Client Name...');
    await page.type('#clientName', 'Nattapong (E2E Automation Test)', { delay: 30 });
    
    console.log('✍️ Typing Client Company...');
    await page.type('#clientCompany', 'Ideas Generation Co.', { delay: 30 });
    
    console.log('✍️ Typing Client Email...');
    await page.type('#clientEmail', 'nattapong@ideasjeneration.com', { delay: 30 });
    
    console.log('✍️ Typing Client Phone...');
    await page.type('#clientPhone', '+66 89 765 4321', { delay: 30 });

    console.log('🗂️ Selecting service option: Marketing & Brand Consulting...');
    await page.select('#interestService', 'Marketing & Brand Consulting');
    await sleep(1000);

    console.log('✍️ Typing Message / Challenge Details...');
    await page.type('#clientMessage', 'Hello Nutthinee, this is an automated end-to-end (E2E) automation test confirming that inputs are successfully validated and the loading/success state is rendered properly. Awesome UI design!', { delay: 10 });
    await sleep(2000); // Pause to let user check the filled form

    console.log('🖱️ Clicking Submit button...');
    const submitBtn = await page.$('.contact-form button[type="submit"]');
    await submitBtn.click();

    console.log('⏳ Waiting for success message to pop up...');
    // We wait for the success banner to show up (display: flex)
    await page.waitForSelector('#formSuccessMessage', { visible: true, timeout: 6000 });
    console.log('✅ Form submitted successfully! Success notification is visible.');
    
    await sleep(3500); // Keep open so user can read the success message
    
    console.log('🎉 E2E Test: Contact Form Submission completed successfully!');
  } catch (error) {
    console.error('❌ E2E Test Failed with error:', error);
  } finally {
    await browser.close();
  }
})();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
