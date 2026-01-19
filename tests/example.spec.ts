import { test, expect } from '@playwright/test';

test('checkout', async ({ page }) => {
  await page.goto('https://www.brooksrunning.com/en_us');
  await page.locator('iframe[title="Sign Up via Text for Offers"]').contentFrame().getByTestId('closeIcon').click();
  await page.getByRole('link', { name: 'Men', exact: true }).click();
  await page.getByLabel('scrollable content').getByText('Shoes', { exact: true }).click();
  await page.getByText('5.0', { exact: true }).click();
  await page.getByText('Blue').click();
  await page.locator('.turn-to-rating-5-0').click();
  await page.getByRole('link', { name: 'Hyperion Elite LD 2 image' }).click();
  await page.getByRole('button', { name: 'M4.0 / W5.5' }).click();
  await page.getByRole('button', { name: 'Add to cart $' }).click();
  await page.goto('https://www.brooksrunning.com/en_us/check-out/account-login/');
  await page.getByRole('link', { name: 'Check out as guest' }).click();
  await page.getByRole('textbox', { name: 'First name *' }).fill('test');
  await page.getByRole('textbox', { name: 'Last name *' }).click();
  await page.getByRole('textbox', { name: 'Last name *' }).fill('test');
  await page.getByRole('textbox', { name: 'Address 1 - Street or P.O.' }).click();
  await page.getByRole('textbox', { name: 'Address 1 - Street or P.O.' }).fill('30');
  await page.getByText('East Silverado Ranch Boulevard').click();
  await page.getByRole('button', { name: 'Continue to shipping method' }).click();
  await page.getByRole('button', { name: 'Continue to payment' }).click();
  await page.locator('.m-payment-method__wrapper.add-pseudo-radio').first().click();
});