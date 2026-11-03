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

  test('after the first page of a session the bar becomes a pill; the pill reopens it; the choice then sticks', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('cookie-banner')).toBeVisible();
    await page.goto('/blog/'); // a second page in the same tab
    await expect(page.getByTestId('cookie-banner')).toHaveCount(0);
    const pill = page.getByTestId('cookie-pill');
    await expect(pill).toBeVisible();
    await pill.click();
    const banner = page.getByTestId('cookie-banner');
    await expect(banner).toBeVisible();
    await banner.getByRole('button', { name: /accept all/i }).click();
    await expect(banner).toBeHidden();
    await expect(pill).toHaveCount(0);
    await page.goto('/portfolio/');
    await expect(page.getByTestId('cookie-banner')).toHaveCount(0);
    await expect(page.getByTestId('cookie-pill')).toHaveCount(0);
  });

  test('a choice holds for the page even when the browser blocks cookies and storage', async ({ browser }) => {
    const ctx = await browser.newContext();
    await ctx.addInitScript(() => {
      Object.defineProperty(document, 'cookie', { configurable: true, get: () => '', set: () => {} });
      Storage.prototype.setItem = () => { throw new Error('storage blocked'); };
      Storage.prototype.getItem = () => null;
    });
    const page = await ctx.newPage();
    await page.goto('/');
    const banner = page.getByTestId('cookie-banner');
    await expect(banner).toBeVisible();
    await banner.getByRole('button', { name: /essential/i }).click();
    await expect(banner).toBeHidden();
    await ctx.close();
  });

  test('a returning visitor gets the cookie renewed for another year (Safari caps script cookies at 7 days)', async ({ page, context }) => {
    await context.addCookies([{ name: 'dg_consent', value: 'v1.analytics=granted.ts=1700000000', domain: 'localhost', path: '/', expires: Math.floor(Date.now() / 1000) + 3 * 86400 }]);
    await page.goto('/');
    await expect(page.getByTestId('cookie-banner')).toHaveCount(0);
    // the renewal happens once React mounts, so poll rather than read the jar straight after load
    await expect.poll(async () => (await context.cookies()).find((c) => c.name === 'dg_consent')?.expires ?? 0, { timeout: 10_000 }).toBeGreaterThan(Date.now() / 1000 + 300 * 86400);
    expect(await page.evaluate(() => localStorage.getItem('dg_consent'))).toMatch(/analytics=granted/);
  });

  test('a stale consent version re-prompts', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => { document.cookie = 'dg_consent=v0.analytics=granted.ts=1; Path=/'; localStorage.setItem('dg_consent', 'v0.analytics=granted.ts=1'); });
    await page.reload();
    await expect(page.getByTestId('cookie-banner')).toBeVisible();
  });
});
