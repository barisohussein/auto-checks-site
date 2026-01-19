export async function waitForCartStabilization(page) {
    await page.waitForTimeout(5000);
  }
  