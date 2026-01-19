import { test, expect } from '@playwright/test';

test('shoes → PDP → add to cart → guest checkout → payment', async ({ page }) => {
  // 1. Go to filtered shoes page
  await page.goto(
    'https://www.brooksrunning.com/en_us/shoes/?prefn1=size_Shoe&prefv1=5.0'
  );

  // 2. Close signup modal (iframe) if present
  const signupFrame = page.locator('iframe[title="Sign Up via Text for Offers"]');
  if (await signupFrame.count()) {
    const frame = await signupFrame.contentFrame();
    await frame?.getByTestId('closeIcon').click();
  }

  // 3. Click first product image (validated via DevTools)
  const firstProductImage = page.locator('img[data-event-label="0"]').first();
  await firstProductImage.waitFor({ state: 'visible' });
  await firstProductImage.scrollIntoViewIfNeeded();
  await firstProductImage.click();

  // 4. Add to cart
  await page.getByRole('button', { name: 'Add to cart $' }).waitFor();
  await page.getByRole('button', { name: 'Add to cart $' }).click();

  await page.getByRole('button', { name: 'Add to cart $' }).click();

  // ⏱️ wait 5 seconds after add to cart
await page.waitForTimeout(5000);
  // 6. Go to checkout login page
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
