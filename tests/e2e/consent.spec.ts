import { expect, test } from '@playwright/test';

test.describe('cookie consent', () => {
  test('first visit shows the banner and loads no Google script; accept all persists and loads gtag', async ({ page, context }) => {
    const google: string[] = [];
    page.on('request', (r) => { if (/googletagmanager|google-analytics/.test(r.url())) google.push(r.url()); });
    await page.goto('/');
    const banner = page.getByTestId('cookie-banner');
    await expect(banner).toBeVisible();
    expect(google).toHaveLength(0);
    expect((await context.cookies()).find((c) => c.name === 'dg_consent')).toBeUndefined();
    await banner.getByRole('button', { name: /accept all/i }).click();
    await expect(banner).toBeHidden();
    const cookie = (await context.cookies()).find((c) => c.name === 'dg_consent');
    expect(cookie?.value).toMatch(/analytics%3Dgranted|analytics=granted/);
    expect(cookie?.expires).toBeGreaterThan(Date.now() / 1000 + 300 * 86400);
    await page.waitForTimeout(800);
    expect(google.length).toBeGreaterThan(0);
    await page.reload();
    await expect(page.getByTestId('cookie-banner')).toHaveCount(0);
  });

  test('essential only: no gtag, remembered on reload, re-openable from the footer', async ({ page }) => {
    const google: string[] = [];
    page.on('request', (r) => { if (/googletagmanager/.test(r.url())) google.push(r.url()); });
    await page.goto('/');
    await page.getByTestId('cookie-banner').getByRole('button', { name: /essential/i }).click();
    await page.waitForTimeout(500);
    expect(google).toHaveLength(0);
    await page.reload();
    await expect(page.getByTestId('cookie-banner')).toHaveCount(0);
    const stored = await page.evaluate(() => localStorage.getItem('dg_consent'));
    expect(stored).toMatch(/analytics=denied/);
    await page.getByRole('button', { name: /manage cookies/i }).click();
    await expect(page.getByTestId('cookie-banner')).toBeVisible();
    await expect(page.getByTestId('cookie-banner')).toContainText(/essential only/i);
  });

  test('a stale consent version re-prompts', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => { document.cookie = 'dg_consent=v0.analytics=granted.ts=1; Path=/'; localStorage.setItem('dg_consent', 'v0.analytics=granted.ts=1'); });
    await page.reload();
    await expect(page.getByTestId('cookie-banner')).toBeVisible();
  });
});
