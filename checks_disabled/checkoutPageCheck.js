const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    await page.goto("https://www.brooksrunning.com/cart", { waitUntil: "networkidle2" });
    await page.click("a[href*='checkout']");
    await page.waitForSelector("form#checkout", { timeout: 5000 });

    console.log("✅ Checkout page check passed");
  } catch (err) {
    console.error("❌ Checkout page check failed:", err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
