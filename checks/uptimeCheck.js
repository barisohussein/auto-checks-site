const puppeteer = require("puppeteer");

const domains = [
  "https://www.brooksrunning.com",
  "https://www.brooksrunning.ca",
  "https://www.brooksrunning.eu"
];

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    for (const url of domains) {
      const response = await page.goto(url, { waitUntil: "networkidle2", timeout: 15000 });
      const status = response.status();
      if (status === 200) {
        console.log(`✅ Uptime check passed for ${url}`);
      } else {
        console.error(`❌ Uptime check failed for ${url} with status: ${status}`);
        process.exit(1);
      }
    }
  } catch (err) {
    console.error("❌ Uptime check failed:", err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
