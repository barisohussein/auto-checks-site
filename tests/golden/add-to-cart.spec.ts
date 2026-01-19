import { test, expect } from '@playwright/test';
import { closeSmsModal } from '../helpers/close-modals';
import { PRODUCT } from '../fixtures/product';
import { waitForCartStabilization } from '../helpers/wait-utils';


test('PDP → Add to cart', { tag: '@golden' }, async ({ page }) => {
  await page.goto(PRODUCT.shoesPage);
  await closeSmsModal(page);

  await page.locator(PRODUCT.imageSelector).first().click();
  await page.locator(PRODUCT.sizeButton).click();

  await page.getByRole('button', { name: /Add to cart/i }).click();
  await waitForCartStabilization(page);

  await page.getByRole('link', { name: 'Cart 1 Items' }).click();
  await page.getByRole('button', { name: 'Checkout' }).click();


});
