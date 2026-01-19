import { test, expect } from '@playwright/test';
import { closeSmsModal } from '../helpers/close-modals';
import { blockPayments } from '../helpers/safety-guards';
import { PRODUCT } from '../fixtures/product';

test('Full guest checkout reaches payment step', { tag: '@golden' }, async ({ page }) => {
test.setTimeout(120000);
  await blockPayments(page);
  await page.goto(PRODUCT.shoesPage);
  await closeSmsModal(page);

  await page.locator(PRODUCT.imageSelector).first().click();
  await page.locator(PRODUCT.sizeButton).click();
  await page.getByRole('button', { name: /Add to cart/i }).click();

  await page.waitForTimeout(5000);
  await page.goto(
    'https://www.brooksrunning.com/en_us/check-out/check-out-process'
  );

  // 8. Fill shipping form
  await page.getByRole('textbox', { name: 'First name *' }).fill('test');
  await page.getByRole('textbox', { name: 'Last name *' }).fill('test');

  await page
    .getByRole('textbox', { name: 'Address 1 - Street or P.O.' })
    .fill('30');

  await page.getByText('East Silverado Ranch Boulevard').click();

  // 9. Continue to shipping method
  await page
    .getByRole('button', { name: 'Continue to shipping method' })
    .click();

  // 10. Continue to payment
  await page
    .getByRole('button', { name: 'Continue to payment' })
    .click();

  // 11. Select first payment method
  const paymentMethod = page
    .locator('.m-payment-method__wrapper.add-pseudo-radio')
    .first();

  await paymentMethod.waitFor({ state: 'visible' });
  await paymentMethod.click();

  // Optional assertion: confirm payment step
  await expect(paymentMethod).toBeVisible();
});
