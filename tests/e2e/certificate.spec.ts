import { expect, test } from '@playwright/test';

test.describe('certificate card', () => {
  const openCert = async (page: import('@playwright/test').Page) => {
    const b = page.locator('.brain');
    await b.scrollIntoViewIfNeeded();
    const growth = b.locator('.brain__node[data-id="growth"]');
    if ((await growth.getAttribute('aria-expanded')) !== 'true') await growth.click({ force: true });
    const badges = b.locator('.brain__icon--cert');
    await expect(badges).toHaveCount(3);
    const icon = b.locator('.brain__icon--cert[aria-label*="Measurement"]');
    await page.waitForTimeout(900); // the icons fan out for ~.85 s; a coordinate click during that lands on the node behind them
    await page.mouse.move(2, 2); // park the (emulated) mouse: a card appearing under a resting cursor gets a synthetic pointerenter, which holds it open
    await icon.dispatchEvent('click');
    const dlg = page.locator('dialog.certdlg[open]');
    await expect(dlg).toBeVisible();
    return { b, growth, icon, dlg };
  };

  test('a Google Ads badge opens the certificate; it holds while hovered and closes by itself afterwards', async ({ page, isMobile }) => {
    await page.goto('/');
    const { icon, dlg } = await openCert(page);
    await expect.poll(() => dlg.locator('img').evaluate((i) => (i as HTMLImageElement).naturalWidth), { timeout: 10000 }).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');
    await expect(dlg.locator('#cert-title')).toContainText(/Measurement/);
    if (!isMobile) {
      await dlg.locator('.certcard').hover();
      await page.waitForTimeout(4500);
      await expect(dlg).toBeVisible(); // held open by the pointer
      expect(await dlg.locator('.certcard').evaluate((el) => getComputedStyle(el).transform)).not.toBe('none'); // tilted
      await page.mouse.move(5, 5);
    }
    await expect(page.locator('dialog.certdlg')).toHaveCount(0, { timeout: 6000 });
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
    if (!isMobile) await expect(icon).toBeFocused();
  });

  test('Escape closes the certificate but keeps the marketing node open', async ({ page }) => {
    await page.goto('/');
    const { growth } = await openCert(page);
    await page.keyboard.press('Escape');
    await expect(page.locator('dialog.certdlg')).toHaveCount(0, { timeout: 2000 });
    await expect(growth).toHaveAttribute('aria-expanded', 'true');
  });

  test('a click or tap on the blurred page closes the certificate', async ({ page, isMobile }) => {
    await page.goto('/');
    await openCert(page);
    if (isMobile) await page.touchscreen.tap(8, 8); else await page.mouse.click(8, 8);
    await expect(page.locator('dialog.certdlg')).toHaveCount(0, { timeout: 2000 });
  });
});
