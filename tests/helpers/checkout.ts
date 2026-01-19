import { Page, expect } from '@playwright/test';

export async function guestCheckoutToPayment(page: Page) {
  await page.goto('https://www.brooksrunning.com/en_us/check-out/check-out-process');
  await page.getByRole('link', { name: /Check out as guest/i }).click();

  await page.getByRole('textbox', { name: 'First name *' }).fill('Test');
  await page.getByRole('textbox', { name: 'Last name *' }).fill('User');
  await page.getByRole('textbox', { name: /Address 1/i }).fill('30');
  await page.getByText('East Silverado Ranch Boulevard').click();

  await page.getByRole('button', { name: /Continue to shipping/i }).click();
  await page.getByRole('button', { name: /Continue to payment/i }).click();

  await expect(
    page.locator('.m-payment-method__wrapper.add-pseudo-radio').first()
  ).toBeVisible();
}
