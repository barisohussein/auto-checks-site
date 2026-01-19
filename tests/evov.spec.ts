import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://www.brooksrunning.com/en_us';

/* ---------- Helpers ---------- */

async function closeSignupModal(page: Page) {
  const iframe = page.locator('iframe[title="Sign Up via Text for Offers"]');
  if (await iframe.count()) {
    const frame = await iframe.contentFrame();
    await frame?.getByTestId('closeIcon').click();
  }
}

async function navigateToMenShoes(page: Page) {
  await page.getByRole('link', { name: 'Men', exact: true }).click();
  await page.getByLabel('scrollable content').getByText('Shoes', { exact: true }).click();
}

async function filterAndSelectProduct(page: Page) {
  await page.getByText('5.0', { exact: true }).click();
  await page.getByText('Blue').click();
  await page.locator('.turn-to-rating-5-0').click();
  await page.getByRole('link', { name: /Hyperion Elite LD 2/i }).click();
}

async function addProductToCart(page: Page) {
  await page.getByRole('button', { name: 'M4.0 / W5.5' }).click();
  await page.getByRole('button', { name: /Add to cart/i }).click();
}

/* ---------- Test Suite ---------- */

test.describe('Brooks checkout flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await closeSignupModal(page);
  });

  test('browse men shoes and open product detail', async ({ page }) => {
    await navigateToMenShoes(page);
    await filterAndSelectProduct(page);

    await expect(
      page.getByRole('button', { name: /Add to cart/i })
    ).toBeVisible();
  });

  test('add product to cart', async ({ page }) => {
    await navigateToMenShoes(page);
    await filterAndSelectProduct(page);
    await addProductToCart(page);

    await expect(page.getByText(/added to cart/i)).toBeVisible();
  });

  test('checkout as guest and reach payment step', async ({ page }) => {
    await navigateToMenShoes(page);
    await filterAndSelectProduct(page);
    await addProductToCart(page);

    await page.goto(`${BASE_URL}/check-out/account-login/`);
    await page.getByRole('link', { name: 'Check out as guest' }).click();

    await page.getByRole('textbox', { name: 'First name *' }).fill('Test');
    await page.getByRole('textbox', { name: 'Last name *' }).fill('User');
    await page
      .getByRole('textbox', { name: 'Address 1 - Street or P.O.' })
      .fill('30');
    await page.getByText('East Silverado Ranch Boulevard').click();

    await page.getByRole('button', { name: 'Continue to shipping method' }).click();
    await page.getByRole('button', { name: 'Continue to payment' }).click();

    await expect(
      page.locator('.m-payment-method__wrapper').first()
    ).toBeVisible();
  });
});
