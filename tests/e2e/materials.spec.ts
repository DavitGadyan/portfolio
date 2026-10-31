import { expect, test } from '@playwright/test';

test.describe('materials', () => {
  test('index lists the tools; the nav item sits right before the CV link', async ({ page, isMobile }) => {
    await page.goto('/materials/');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/materials\/$/);
    const tile = page.locator('.tg__tile').first();
    await expect(tile).toContainText('Claude');
    if (!isMobile) {
      const links = page.locator('header.hdr nav').first().locator('a');
      const labels = (await links.allInnerTexts()).map((s) => s.trim().toLowerCase());
      expect(labels.indexOf('materials')).toBe(labels.indexOf('download my cv') - 1);
      await expect(page.locator('header.hdr nav a[href$="/materials/"]').first()).toHaveAttribute('aria-current', 'page');
    }
    await tile.click();
    await page.waitForURL(/\/materials\/claude\/$/);
  });

  test('the Claude page: technique map, details panel, hover, Escape, Spanish', async ({ page, isMobile }) => {
    await page.goto('/materials/claude/');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute('href', /\/es\/materials\/claude\/$/);
    await expect(page.locator('.tg__tool[aria-current="page"]')).toContainText('Claude');
    const g = page.locator('.tg');
    await expect(g).toBeVisible();
    const nodes = g.locator('.tg__node');
    await expect(nodes).toHaveCount(12);
    await expect(g.locator('.tg__spark')).toHaveCount(12);
    const panel = page.locator('#tg-panel');
    await expect(panel).toHaveAttribute('data-state', 'empty');
    const first = nodes.first();
    const title = await first.locator('.tg__title').innerText();
    await first.click({ force: true }); // the cards animate in
    await expect(first).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toHaveAttribute('data-state', 'open');
    await expect(panel.locator('#tg-panel-title')).toHaveText(title);
    await expect(panel.locator('dd')).toHaveCount(3);
    await expect(g.locator('.tg__wires g[data-open]')).toHaveCount(1);
    if (isMobile) {
      // both boxes in one call: the panel is smooth-scrolling into view and two separate reads would land on different scroll offsets
      const gap = await g.evaluate((el) => { const s = el.querySelector('.tg__stage')!.getBoundingClientRect(), p = document.querySelector('#tg-panel')!.getBoundingClientRect(); return p.top - s.bottom; });
      expect(gap).toBeGreaterThanOrEqual(-1); // the panel sits below the map on phones
    } else {
      await nodes.nth(3).hover({ force: true });
      await expect(g.locator('.tg__wires g[data-hot]')).toHaveCount(1);
    }
    await page.keyboard.press('Escape');
    await expect(first).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toHaveAttribute('data-state', 'empty');
    await page.goto('/es/materials/claude/');
    await expect(page.locator('.tg__node').first().locator('.tg__title')).not.toHaveText(title); // Spanish titles
  });

  test('reduced motion hides the travelling sparks', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/materials/claude/');
    expect(await page.locator('.tg__spark').first().evaluate((el) => getComputedStyle(el).display)).toBe('none');
  });

  test('without JavaScript the techniques are a readable list', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto('/materials/claude/');
    await expect(page.locator('.tglist li')).toHaveCount(12);
    expect(await page.locator('.tglist').evaluate((el) => getComputedStyle(el).display)).not.toBe('none');
    expect(await page.locator('.tg').evaluate((el) => getComputedStyle(el).display)).toBe('none');
    await ctx.close();
  });
});
