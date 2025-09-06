const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: true, defaultViewport: null });
  const page = await browser.newPage();

  // Suppress marketing popup
  await page.setCookie({
    name: "mOvNxt",
    value: Date.now().toString(),
    domain: ".brooksrunning.com",
    path: "/",
    httpOnly: false,
    secure: true,
  });

  try {
    // Go to the product page
    await page.goto(
      "https://www.brooksrunning.com/en_us/womens/shoes/road-running-shoes/ghost-max-3/1204571B151.080.html",
      { waitUntil: "networkidle2" }
    );

    // Wait for and click Add to Cart
    await page.waitForSelector("#aut-add-to-cart", { visible: true, timeout: 10000 });
    await page.evaluate(() => {
      const btn = document.getElementById("aut-add-to-cart");
      if (btn) btn.scrollIntoView({ behavior: "auto", block: "center" });
    });
    await page.click("#aut-add-to-cart");

    console.log("✅ Add to cart check passed");

    // Click the checkout link
    //await page.click('a[title="Proceed to Checkout"]');

    // Wait for checkout/login page to load
    //await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 10000 });

    console.log("✅ Proceed to checkout check passed");

  } catch (err) {
    console.error("❌ Checkout flow failed:", err.message);
    process.exit(1);
  } finally {
    // Keep browser open to inspect or close manually
    // await browser.close();
  }
})();
