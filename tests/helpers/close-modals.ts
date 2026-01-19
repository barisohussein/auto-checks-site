import { Page } from '@playwright/test';

export async function closeSmsModal(page: Page) {
  const iframe = page.locator('iframe[title="Sign Up via Text for Offers"]');

  if (await iframe.count()) {
    const frame = await iframe.contentFrame();
    if (frame) {
      const close = frame.getByTestId('closeIcon');
      if (await close.count()) {
        await close.click({ timeout: 3000 });
      }
    }
  }
}
