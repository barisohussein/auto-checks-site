import { Page } from '@playwright/test';

export async function blockPayments(page: Page) {
  await page.route('**/payments/**', route => route.abort());
  await page.route('**/checkout/payment/**', route => route.abort());
}
