const puppeteer = require("puppeteer");
const fs = require("fs");

const METRICS_FILE = "./last_metrics.json";

// Ensure dummy metrics file exists
if (!fs.existsSync(METRICS_FILE)) {
  const dummyMetrics = {
    ttfb: 500,
    loadTime: 1200,
    domInteractive: 1000,
    inp: 50,
    lcp: 800,
    cls: 0.01
  };
  fs.writeFileSync(METRICS_FILE, JSON.stringify(dummyMetrics, null, 2));
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });
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
    await page.goto("https://www.brooksrunning.com", { waitUntil: "networkidle2" });

    const metrics = await page.evaluate(() => {
      let inp = 0, lcp = 0, cls = 0;

      // INP
      const inpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        inp = Math.max(inp, ...entries.map(e => e.processingStart - e.startTime));
      });
      inpObserver.observe({ type: "event", buffered: true });

      // LCP
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length) lcp = Math.max(...entries.map(e => e.startTime));
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

      // CLS
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          cls += entry.value;
        }
      });
      clsObserver.observe({ type: "layout-shift", buffered: true });

      const nav = performance.getEntriesByType("navigation")[0] || {};
      return {
        ttfb: nav.responseStart - nav.requestStart || 0,
        loadTime: nav.loadEventEnd - nav.startTime || 0,
        domInteractive: nav.domInteractive || 0,
        inp,
        lcp,
        cls
      };
    });

    console.log("Performance Metrics:", metrics);

    // Spike detection (20% threshold)
    const lastMetrics = JSON.parse(fs.readFileSync(METRICS_FILE));
    for (const key of Object.keys(metrics)) {
      const last = lastMetrics[key] || 0;
      const curr = metrics[key];
      if (last && curr > last * 1.2) {
        throw new Error(`Spike detected for ${key}: ${curr} (last ${last})`);
      }
    }

    // Save current metrics
    fs.writeFileSync(METRICS_FILE, JSON.stringify(metrics, null, 2));
    console.log("✅ Performance check completed");

  } catch (err) {
    console.error("❌ Performance check failed:", err.message);
  } finally {
    await browser.close();
  }
})();
