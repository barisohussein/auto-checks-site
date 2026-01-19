import { Page, expect } from '@playwright/test';

export async function goToCategory(page: Page) {
  await page.goto(
    'https://www.brooksrunning.com/en_us/shoes/?prefn1=size_Shoe&prefv1=5.0'
  );

  const iframe = page.locator('iframe[title="Sign Up via Text for Offers"]');
  if (await iframe.count()) {
    const frame = await iframe.contentFrame();
    if (frame) {
      const close = frame.getByTestId('closeIcon');
      if (await close.count()) {
        await close.click({ timeout: 3000 });
      }
    }
  }
}

export async function clickFirstProduct(page: Page) {
  const product = page.locator('img[data-event-label="0"]').first();
  await expect(product).toBeVisible();
  await product.click();

  // Product page should be HTML
  await expect(page).toHaveURL(/\/\d+\.html/);
}
