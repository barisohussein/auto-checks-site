import { test, expect } from '@playwright/test';
import { closeSmsModal } from '../helpers/close-modals';
import { blockPayments } from '../helpers/safety-guards';
import { PRODUCT } from '../fixtures/product';

test('Guest checkout entry', { tag: '@golden' }, async ({ page }) => {
  await blockPayments(page);
  await page.goto(PRODUCT.shoesPage);
  await closeSmsModal(page);

  await page.locator(PRODUCT.imageSelector).first().click();
  await page.locator(PRODUCT.sizeButton).click();
  await page.getByRole('button', { name: /Add to cart/i }).click();

  await page.waitForTimeout(5000);
  await page.getByRole('link', { name: 'Cart 1 Items' }).click();
  await page.getByRole('button', { name: 'Checkout' }).click();

  await expect(page).toHaveURL(/check-out/);
});
