const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

(async () => {
  // Launch headless Chrome
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const opts = {
    port: chrome.port,
    output: 'json',
    onlyCategories: ['performance']
  };

  const url = 'https://brooksrunning.com';
  const resultsArray = [];

  for (let i = 0; i < 5; i++) { // run 5 synthetic tests
    const runnerResult = await lighthouse(url, opts);
    const lhr = runnerResult.lhr;
    const performanceScore = lhr.categories.performance.score * 100; // Lighthouse score 0-100
    resultsArray.push(performanceScore);
  }

  // Calculate median
  resultsArray.sort();
  const median = resultsArray[Math.floor(resultsArray.length / 2)];
  console.log('Median Performance Score:', median);

  await chrome.kill();
})();
