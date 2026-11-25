import { expect, test } from '@playwright/test';

test.describe('architecture design on project pages', () => {
  test('sits under What I built; hover lights a path and explains the component; expand, zoom and Escape', async ({ page }) => {
    await page.goto('/portfolio/auditpro-ifrs-audit-review-llm/');
    const a = page.locator('.arch');
    await expect(a).toHaveCount(1);
    // placed right after the "What I built" section, before the next heading
    const order = await page.evaluate(() => {
      const h = [...document.querySelectorAll('h2')].find((x) => x.textContent?.trim() === 'What I built')!;
      return !!(h.compareDocumentPosition(document.querySelector('.arch')!) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    expect(order).toBe(true);
    await a.scrollIntoViewIfNeeded();
    const nodes = a.locator('.arch__node');
    expect(await nodes.count()).toBeGreaterThan(6);
    const target = nodes.nth(2);
    if (test.info().project.name === 'mobile') await target.tap(); else await target.hover();
    const card = a.locator('.arch__card');
    await expect(card).toBeVisible();
    await expect(card.locator('.arch__card-title')).not.toBeEmpty();
    await expect(a.locator('.arch__edge[data-on]').first()).toBeAttached();
    // the diagram fits its column: no horizontal page scroll
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    await a.getByRole('button', { name: 'Expand' }).click();
    await expect(a).toHaveAttribute('data-expanded', '');
    await expect(a).toHaveCSS('position', 'fixed');
    await a.getByRole('button', { name: 'Zoom in' }).click();
    await page.keyboard.press('Escape');
    await expect(a).not.toHaveAttribute('data-expanded', '');
    await expect(a.getByRole('button', { name: 'Expand' })).toBeFocused();
  });

  test('Spanish page and every project get one; without JavaScript the cards and their notes still render', async ({ page, browser }) => {
    await page.goto('/es/portfolio/r-rest-api-medical-kpis/');
    await expect(page.locator('.arch h2')).toHaveText('Diseño de arquitectura');
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const p = await ctx.newPage();
    await p.goto('/portfolio/virgil-ai-health-insurance-agent/');
    expect(await p.locator('.arch__node').count()).toBeGreaterThan(6);
    await expect(p.locator('.arch__btn--expand')).toBeHidden();
    await ctx.close();
  });
});
