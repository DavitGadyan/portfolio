import { expect, test } from '@playwright/test';

test.describe('service cards', () => {
  test('the description appears on hover in its own space and disappears as soon as the pointer leaves', async ({ page, isMobile }) => {
    test.skip(isMobile, 'hover only');
    await page.goto('/');
    const card = page.locator('#services .svc').first();
    const panel = card.locator('.svc__panel');
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800); // reveal entrance
    await expect(panel).toBeHidden();
    await card.hover();
    await expect(panel).toBeVisible();
    await expect(card).toHaveAttribute('data-state', 'open');
    const li = (await card.locator('xpath=..').boundingBox())!, pb = (await panel.boundingBox())!;
    expect(pb.y + pb.height).toBeLessThanOrEqual(li.y + li.height + 1); // in flow: never floats over the next row
    await expect(panel).toContainText(/\w+/);
    await page.mouse.move(2, 2);
    await expect(panel).toBeHidden({ timeout: 600 });
  });

  test('tap (or Enter) pins the details open; tapping again or outside closes them', async ({ page, isMobile }) => {
    await page.goto('/');
    const card = page.locator('#services .svc').first();
    const btn = card.locator('.svc__btn');
    const panel = card.locator('.svc__panel');
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await expect(panel).toBeHidden();
    if (isMobile) await btn.tap(); else { await btn.focus(); await page.keyboard.press('Enter'); }
    await expect(panel).toBeVisible();
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
    if (isMobile) await btn.tap(); else await page.keyboard.press('Enter');
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toBeHidden({ timeout: 2000 });
    // pin again, then close from outside
    if (isMobile) await btn.tap(); else { await btn.focus(); await page.keyboard.press('Enter'); }
    await expect(panel).toBeVisible();
    if (isMobile) await page.touchscreen.tap(10, 10); else await page.mouse.click(10, 10);
    await expect(panel).toBeHidden({ timeout: 2000 });
  });

  test('without JavaScript every service shows its details in flow', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto('/');
    await expect(page.locator('#services .svc__panel')).toHaveCount(10);
    for (const p of await page.locator('#services .svc__panel').all()) await expect(p).toBeVisible();
    await ctx.close();
  });
});
