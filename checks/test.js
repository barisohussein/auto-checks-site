const puppeteer = require("puppeteer");
const lighthouse = require("lighthouse");
const { URL } = require("url");

const url = "https://brooksrunning.com/en_us"; // change to your site

const run = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--remote-debugging-port=9222"]
  });

  // Create a page and inject JS before Lighthouse runs
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  // Hide body before Lighthouse measures CLS
  await page.evaluate(() => {
    document.body.style.display = "none";
  });

  // Run Lighthouse against the existing Chrome instance
  const result = await lighthouse(url, {
    port: new URL(browser.wsEndpoint()).port,
    output: "json",
    onlyCategories: ["performance"]
  });

  console.log("CLS score:", result.lhr.audits["cumulative-layout-shift"].displayValue);

  await browser.close();
};

run();
