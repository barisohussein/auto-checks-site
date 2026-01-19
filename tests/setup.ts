import { test } from '@playwright/test';
import { createOpsgenieAlert } from './helpers/opsgenie';

test.afterEach(async ({}, testInfo) => {
  if (testInfo.status !== 'passed') {
    await createOpsgenieAlert(
      `Playwright test failed: ${testInfo.title}`,
      `Project: ${testInfo.project.name}\nFile: ${testInfo.file}\nError: ${testInfo.error?.message}`
    );
  }
});
