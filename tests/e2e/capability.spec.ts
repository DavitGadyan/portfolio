import { expect, test } from '@playwright/test';

test.describe('skills map', () => {
  test('clicking a skill opens its tools; Escape and the close button collapse it', async ({ page }) => {
    const logoRequests: string[] = [];
    page.on('request', (r) => { if (r.url().includes('/logos/')) logoRequests.push(r.url()); });
    await page.goto('/');
    const b = page.locator('.brain');
    await b.scrollIntoViewIfNeeded();
    await expect(b.locator('.brain__node')).toHaveCount(8);
    expect(logoRequests).toHaveLength(0);

    const ai = b.locator('.brain__node[data-id="ai"]');
    await expect(ai).toContainText(/AI Agents|Agentes IA/);
    await ai.click({ force: true }); // force: the gentle float animation never lets Playwright's stability check pass
    await expect(ai).toHaveAttribute('aria-expanded', 'true');
    const icons = b.locator('.brain__icon');
    await expect(icons).toHaveCount(15);
    await expect(b.locator('.brain__icon[aria-label="LangGraph"]')).toBeVisible();
    await expect(b.locator('.brain__icon[aria-label="Grok (xAI)"]')).toBeVisible();
    await expect.poll(() => icons.locator('img').evaluateAll((imgs) => imgs.every((i) => (i as HTMLImageElement).naturalWidth > 0)), { timeout: 10000 }).toBe(true);
    expect(logoRequests.length).toBeGreaterThan(0);
    // the expanded node sits at the centre of the map
    await page.waitForTimeout(600);
    const mb = (await b.boundingBox())!, nb = (await ai.boundingBox())!;
    expect(Math.abs(nb.x + nb.width / 2 - (mb.x + mb.width / 2))).toBeLessThan(6);

    await page.keyboard.press('Escape');
    await expect(icons).toHaveCount(0);
    await expect(ai).toHaveAttribute('aria-expanded', 'false');

    await b.locator('.brain__node[data-id="security"]').click({ force: true });
    await expect(b.locator('.brain__icon[aria-label="Kali Linux"]')).toBeVisible();
    await ai.click({ force: true }); // switching straight to another node
    await expect(b.locator('.brain__icon[aria-label="OpenAI"]')).toBeVisible();
    await page.waitForTimeout(700); // let it finish gliding to the centre
    await ai.click({ force: true }); // clicking the centred node collapses
    await expect(icons).toHaveCount(0);
  });

  test('without JavaScript the seven stages are a readable list', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto('/');
    await expect(page.locator('.capmap li')).toHaveCount(7);
    expect(await page.locator('.capmap').evaluate((el) => getComputedStyle(el).display)).not.toBe('none');
    expect(await page.locator('.brain').evaluate((el) => getComputedStyle(el).display)).toBe('none');
    await ctx.close();
  });
});
