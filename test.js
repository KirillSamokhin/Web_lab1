const puppeteer = require("puppeteer");

test("Headless test", async () => {
    const browser = await puppeteer.launch({
        headless: false,
    });

    const page = await browser.newPage();

    await page.goto('http://localhost:3000/login');

    await page.waitForTimeout(2000);

    await page.type('input[type=text]', 'Иван');

    await page.click('#loginButton');

    await page.waitForTimeout(1000);

    const stockPercentageBefore = await page.$eval('#SBUXpercentage', (span) => span.textContent);

    console.log('======== BEFORE ========')
    console.log(stockPercentageBefore)

    await page.click('#trade');

    await page.waitForTimeout(1000);

    await page.click('#SBUXplusSell');

    await page.click('#SBUXsell');

    await page.click('#brokers');

    await page.waitForTimeout(1000);

    const stockPercentageAfter = await page.$eval('#SBUXpercentage', (span) => span.textContent);

    console.log('======== AFTER ========')
    console.log(stockPercentageAfter)

    await browser.close();
}, 18000)