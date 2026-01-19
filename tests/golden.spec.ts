import { test } from '@playwright/test';
import { goToCategory, clickFirstProduct } from './helpers/navigation';
import { addToCart } from './helpers/cart';
import { guestCheckoutToPayment } from './helpers/checkout';

test('Golden Path: browse → cart → checkout (no payment)', async ({ page }) => {
  await goToCategory(page);
  await clickFirstProduct(page);
  await addToCart(page);
  await guestCheckoutToPayment(page);
});
