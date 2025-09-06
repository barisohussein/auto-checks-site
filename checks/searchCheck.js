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
    // Go to site
    await page.goto("https://www.brooksrunning.com", { waitUntil: "networkidle2" });

    // Set search value inside the page
    await page.evaluate(() => {
      const inputElement = document.getElementById('input');
      if (inputElement) {
        inputElement.click();
        inputElement.value = 'Glycerin';
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        inputElement.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    // Press Enter to search
    await page.keyboard.press("Enter");

    // Wait for navigation to complete fully
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    // Wait for at least one product tile to ensure page is loaded
    //await page.waitForSelector(".m-product-tile__item-wrapper", { timeout: 10000 });

    console.log("✅ Search executed successfully!");

    // Define selectors to confirm
    const selectors = [
      "label[for='pcp-filter-gender-0']",         // Women
      "label[for='pcp-filter-size_Shoe-0']",      // Size 5.0
      "label[for='pcp-filter-turntoAverageRating-0']", // Rating filter
      "img.a-responsive-image__img",              // Product images
      "svg.icon-account-icon",                     // Account icon
      "svg.icon-cart-icon",                        // Cart icon
      ".a-rating",                                 // First rating
      "div.m-product-tile__name",                 // Product names
      "span.pricing__sale.js-sale-price",         // Sale price
      "img.a-responsive-image__img[data-swatch-id]", // Swatch images
      "label[for='pcp-filter-color-black']"
    ];

    // Check each selector
    for (const sel of selectors) {
      const exists = await page.$(sel);
      console.log(`${sel} → ${exists ? "✅ Found" : "❌ Not found"}`);
    }

  } catch (err) {
    console.error("❌ Script failed:", err.message);
    process.exit(1);
  } finally {
    // Keep browser open for inspection
    await browser.close();
  }
})();
