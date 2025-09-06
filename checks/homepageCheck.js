const { chromium } = require('playwright');

async function checkPage(baseUrl, selectors = []) {
  const browser = await chromium.launch({ headless: true, slowMo: 250 });
  const page = await browser.newPage();
  let result = { url: baseUrl, status: "PASS", details: "" };

  try {
    const response = await page.goto(baseUrl, { timeout: 15000 });
    if (!response) throw new Error("No response received");
    if (response.status() !== 200) throw new Error(`HTTP ${response.status()}`);

    if (selectors.length === 0) {
      // Homepage check
      const title = await page.title();
      if (!title.includes("Brooks")) throw new Error("Title missing 'Brooks'");
      const logoVisible = await page.isVisible("img[alt*='Brooks']");
      if (!logoVisible) throw new Error("Logo not visible");
    } else {
      // Validate all required selectors for category pages
      for (const sel of selectors) {
        const visible = await page.isVisible(sel).catch(() => false);
        if (!visible) throw new Error(`Missing selector: ${sel}`);
      }
    }

    // Wait briefly so you can see results
    await page.waitForTimeout(2000);

  } catch (err) {
    result.status = "FAIL";
    result.details = err.message;
  }

  await browser.close();
  return result;
}

async function runChecks() {
  const selectors = [
    "label[for='pcp-filter-size_Shoe-0']",      // Size 5.0
    "label[for='pcp-filter-turntoAverageRating-0']", // Rating filter
    "img.a-responsive-image__img",              // Product images
    "svg.icon-account-icon",                    // Account icon
    "svg.icon-cart-icon",                       // Cart icon
    ".a-rating",                                // First rating
    "div.m-product-tile__name",                 // Product names
    "span.pricing__sale.js-sale-price",         // Sale price
    "img.a-responsive-image__img[data-swatch-id]", // Swatch images
    "label[for='pcp-filter-color-black']"       // Black color filter
  ];

  const urls = [
    { url: "https://www.brooksrunning.com/en_us/", selectors: [] }, // homepage
    { url: "https://www.brooksrunning.com/en_us/womens/", selectors }, // womens
    { url: "https://www.brooksrunning.com/en_us/mens/", selectors } // mens
  ];

  const results = [];
  for (const { url, selectors } of urls) {
    const res = await checkPage(url, selectors);
    results.push(res);
  }

  console.table(results);
}

runChecks();
