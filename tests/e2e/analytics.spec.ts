import { expect, test } from '@playwright/test';

type Entry = unknown[] | Record<string, unknown>;
const layer = (page: import('@playwright/test').Page) => page.evaluate(() => (window.dataLayer ?? []).map((e) => (e && typeof e === 'object' && 'length' in (e as object) ? Array.from(e as ArrayLike<unknown>) : e)) as Entry[]);

test.describe('page tracking', () => {
  test('every client-side navigation sends its own page_view with the new title, path and content group', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('cookie-banner').getByRole('button', { name: /accept all/i }).click();
    await expect.poll(async () => (await layer(page)).some((e) => Array.isArray(e) && e[0] === 'config'), { timeout: 5000 }).toBe(true);
    const config = (await layer(page)).find((e) => Array.isArray(e) && e[0] === 'config') as unknown[];
    expect((config[2] as { content_group: string }).content_group).toBe('home');

    const card = page.locator('a[href$="/portfolio/virgil-ai-health-insurance-agent/"]').first();
    await card.scrollIntoViewIfNeeded();
    await card.evaluate((a) => (a as HTMLAnchorElement).click()); // through next/link's handler; a coordinate click hits the caption overlay that phones draw over the card
    await page.waitForURL(/\/portfolio\/virgil-ai-health-insurance-agent\/$/);
    const view = async () => (await layer(page)).find((e) => Array.isArray(e) && e[0] === 'event' && e[1] === 'page_view' && String((e[2] as { page_path?: string })?.page_path).includes('virgil')) as unknown[] | undefined;
    await expect.poll(view, { timeout: 5000 }).toBeTruthy();
    const p = (await view())![2] as Record<string, string>;
    expect(p.page_title).toMatch(/Virgil/);
    expect(p.content_group).toBe('project');
    expect(p.page_path).toBe('/portfolio/virgil-ai-health-insurance-agent/');
    expect(p.language).toBe('en');
    // the data layer survived, i.e. it was a client-side navigation, not a reload
    expect((await layer(page)).some((e) => Array.isArray(e) && e[0] === 'config')).toBe(true);

    await page.goBack();
    await page.waitForURL(/\/$/);
    await expect.poll(async () => (await layer(page)).filter((e) => Array.isArray(e) && e[0] === 'event' && e[1] === 'page_view').length, { timeout: 5000 }).toBe(2);
    const home = (await layer(page)).filter((e) => Array.isArray(e) && e[0] === 'event' && e[1] === 'page_view').pop() as unknown[];
    expect((home[2] as { content_group: string }).content_group).toBe('home');
  });
});
