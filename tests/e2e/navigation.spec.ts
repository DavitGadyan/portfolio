import { expect, test } from '@playwright/test';

test.describe('language switcher and navigation', () => {
  test('switcher maps the current path and hash to the other locale', async ({ page }) => {
    await page.goto('/portfolio/virgil-ai-health-insurance-agent/');
    const es = page.locator('header .lang a[hreflang="es"]');
    await expect(es).toHaveAttribute('href', '/es/portfolio/virgil-ai-health-insurance-agent/');
    await es.click();
    await expect(page).toHaveURL(/\/es\/portfolio\/virgil-ai-health-insurance-agent\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.locator('header .lang a[hreflang="en"]')).toHaveAttribute('href', '/portfolio/virgil-ai-health-insurance-agent/');
    expect(await page.evaluate(() => localStorage.getItem('dg_lang'))).toBe('es');
  });

  test('home: header turns solid after scrolling and section links point to anchors', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header.hdr')).toHaveClass(/hdr--transparent/);
    await page.evaluate(() => window.scrollTo(0, 1200));
    await expect(page.locator('header.hdr')).toHaveClass(/hdr--solid/);
    await page.goto('/blog/');
    await expect(page.locator('header.hdr')).toHaveClass(/hdr--solid/);
    await expect(page.locator('header nav a', { hasText: /about/i }).first()).toHaveAttribute('href', '/#about');
    await page.goto('/es/blog/');
    await expect(page.locator('header nav a', { hasText: /sobre/i }).first()).toHaveAttribute('href', '/es/#about');
  });

  test('burger opens a modal dialog, Escape closes it and returns focus', async ({ page }) => {
    await page.goto('/');
    const burger = page.locator('header .burger');
    await burger.click();
    const dialog = page.locator('dialog#fullscreen-nav');
    await expect(dialog).toHaveAttribute('open', '');
    await expect(burger).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(dialog).not.toHaveAttribute('open', '');
    await expect(burger).toBeFocused();
  });

  test('portfolio filter hides non-matching cards without JS state', async ({ page }) => {
    await page.goto('/portfolio/');
    const cards = page.getByTestId('project-card');
    const all = await cards.count();
    expect(all).toBe(36);
    await page.locator('label[for="f-security-compliance"]').click();
    await expect(cards.filter({ visible: true })).toHaveCount(2);
    await expect(page.locator('.pnote')).toBeVisible();
    await page.locator('label[for="f-all"]').click();
    await expect(cards.filter({ visible: true })).toHaveCount(all);
  });

  test('header offers the CV download instead of a booking link, and the logo is a plain home link', async ({ page }) => {
    await page.goto('/blog/');
    const cv = page.locator('header.hdr nav a[download]');
    await expect(cv).toHaveAttribute('href', /David_Gadyan_Resume4\.pdf$/);
    await expect(cv).toHaveText(/download my cv/i);
    await expect(page.locator('header.hdr nav a', { hasText: /book a call/i })).toHaveCount(0);
    expect(await page.locator('header.hdr .hdr__logo').evaluate((el) => el.tagName)).toBe('A');
  });

  test('portfolio filter reflows the grid without leaving empty cells', async ({ page }) => {
    await page.goto('/portfolio/');
    await page.locator('label[for="f-security-compliance"]').click();
    const grid = page.locator('[data-testid="project-grid"]');
    const visible = grid.locator('> [data-cat]:visible');
    await expect(visible).toHaveCount(2);
    // layout position (unaffected by the reveal transform): the first visible card occupies the grid's first cell
    const pos = await visible.first().evaluate((el) => { const g = el.parentElement as HTMLElement; return [el.offsetLeft - g.offsetLeft, el.offsetTop - g.offsetTop]; });
    expect(Math.abs(pos[0])).toBeLessThan(2);
    expect(Math.abs(pos[1])).toBeLessThan(2);
    for (const card of await visible.all()) await expect(card.locator('.pcard')).toHaveAttribute('data-cat', /security-compliance/);
  });

  test('every page has one h1, canonical and hreflang pairs', async ({ page }) => {
    for (const p of ['/', '/es/', '/portfolio/', '/es/blog/', '/cookies/']) {
      await page.goto(p);
      expect(await page.locator('h1').count()).toBe(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveCount(1);
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);
    }
  });
});

