import { type Page } from '@playwright/test';
import * as path from 'path';

/**
 * Screenshot Helper
 * Saves screenshots to C:\MyQAProject\screenshots\
 * Naming convention: <testName>_<step>_<timestamp>.png
 */

const SCREENSHOT_DIR = path.resolve('screenshots');

/**
 * Take a full-page screenshot and save to the screenshots folder.
 * @param page       Playwright Page instance
 * @param filename   e.g. 'login_success' → saved as 'login_success_<ts>.png'
 */
export async function takeScreenshot(page: Page, filename: string): Promise<string> {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(SCREENSHOT_DIR, `${filename}_${ts}.png`);
  await page.screenshot({ path: filePath, fullPage: true });
  return filePath;
}

/**
 * Take a screenshot of a specific element.
 */
export async function takeElementScreenshot(
  page: Page,
  selector: string,
  filename: string,
): Promise<string> {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(SCREENSHOT_DIR, `${filename}_${ts}.png`);
  await page.locator(selector).screenshot({ path: filePath });
  return filePath;
}
