import { Page, expect } from '@playwright/test';

export async function addToCart(page: Page) {
  // Ensure PDP structure exists (specifically the size grid)
  await expect(page.locator('ul[id^="size_Shoe"]')).toBeVisible();
  await expect(page.locator('.m-buy-box-header__price')).toBeVisible();
  await expect(page.locator('ul.js-color-attributes')).toBeVisible();

  // Click first available size (not sold out)
  const sizeButton = page.locator('ul[id^="size_Shoe"] button[data-attr="size_Shoe"]:not([disabled])').first();
  await expect(sizeButton).toBeVisible();
  await sizeButton.click();

  // Click Add to cart
  const addToCartButton = page.getByRole('button', { name: /Add to cart/i });
  await expect(addToCartButton).toBeVisible();
  await addToCartButton.click();

}
