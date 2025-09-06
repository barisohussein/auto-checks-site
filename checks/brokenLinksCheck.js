const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto("https://www.brooksrunning.com", { waitUntil: "networkidle2" });
    
    // Get only http(s) links
    const links = await page.$$eval("a", as =>
      as.map(a => a.href).filter(href => href && href.startsWith("http"))
    );

    console.log(`Found ${links.length} links, checking first 20...`);

    for (let link of links.slice(0, 40)) {
      try {
        const res = await page.goto(link, { waitUntil: "domcontentloaded" });
        if (!res) {
          console.warn(`⚠️ Skipped non-navigable link: ${link}`);
          continue;
        }
        if (res.status() === 404) {
          throw new Error(`Broken link: ${link}`);
        }
        console.log(`✅ OK: ${link} (${res.status()})`);
      } catch (err) {
        console.error(`❌ Error with ${link}: ${err.message}`);
      }
    }

    console.log("✅ Broken links check finished");
  } catch (err) {
    console.error("❌ Script failed:", err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
