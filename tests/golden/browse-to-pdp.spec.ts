import { test, expect } from '@playwright/test';
import { closeSmsModal } from '../helpers/close-modals';
import { PRODUCT } from '../fixtures/product';

test('Browse shoes → PDP loads', { tag: '@golden' }, async ({ page }) => {
  await page.goto(PRODUCT.shoesPage);
  await closeSmsModal(page);

  const productImage = page.locator(PRODUCT.imageSelector).first();
  await expect(productImage).toBeVisible();
  await productImage.click();

  await expect(page).toHaveURL(/\.html/);
});
