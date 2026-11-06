import { expect, test } from '@playwright/test';

/** The two model posts of 2026-11-06: tables, SVG figures, code blocks and one interactive stack diagram each. */
const POSTS = [
  {
    slug: 'which-llm-to-choose-2026', tables: 12, svgs: 2, codeBlocks: 1,
    title: { en: /Which LLM Should You Use/, es: /Qué LLM usar/ },
    tabs: ['Proprietary API', 'Self-hosted open weights', 'Multi-model routing'], rows: 8, firstChip: 'Next.js', thirdFirstChip: 'Customer, employee or API',
    layer: { en: 'Models', es: 'Modelos' },
  },
  {
    slug: 'microsoft-decision-1-decision-model-use-cases', tables: 7, svgs: 3, codeBlocks: 2,
    title: { en: /Microsoft Decision-1/, es: /Microsoft Decision-1/ },
    tabs: ['Support triage', 'Agent loop', 'Evaluation and labelling'], rows: 6, firstChip: 'Email, chat, web form', thirdFirstChip: 'Model outputs or raw records',
    layer: { en: 'Decision model', es: 'Modelo de decisión' },
  },
] as const;

test.describe('model posts', () => {
  for (const p of POSTS) for (const locale of ['en', 'es'] as const) {
    test(`${p.slug} (${locale}): tables, figures, code and the interactive diagram`, async ({ page }) => {
      await page.goto(`${locale === 'es' ? '/es' : ''}/blog/${p.slug}/`);
      await expect(page.locator('h1')).toHaveText(p.title[locale]);
      await expect(page.locator('.prose-dg table:visible')).toHaveCount(p.tables);
      await expect(page.locator('.prose-dg figure.fig:not(.fig--stacks) svg')).toHaveCount(p.svgs);
      await expect(page.locator('.prose-dg pre code')).toHaveCount(p.codeBlocks);
      await expect(page.locator('.prose-dg figcaption').first()).toContainText(locale === 'en' ? 'Figure 1.' : 'Figura 1.');
      const fig = page.locator('figure.fig--stacks');
      await expect(fig).toHaveCount(1);
      await expect(fig.locator('.stk-nojs')).toBeHidden();
      const stk = fig.locator('.stk');
      await stk.scrollIntoViewIfNeeded();
      const tabs = stk.locator('[role="tab"]');
      await expect(tabs).toHaveText([...p.tabs]);
      await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
      await expect(stk.locator('.stk__row')).toHaveCount(p.rows);
      await expect(stk.locator('.stk__chip').first()).toHaveText(p.firstChip);
      await expect(stk.locator('.stk__lname', { hasText: p.layer[locale] })).toHaveCount(1);
      // every brand mark on the first tab loads
      await expect.poll(() => stk.locator('.stk__chip img').evaluateAll((imgs) => imgs.every((i) => (i as HTMLImageElement).naturalWidth > 0)), { timeout: 10000 }).toBe(true);
      // open a layer note, then switch to the third stack
      await stk.locator('.stk__row').nth(1).locator('.stk__layer').click();
      await expect(stk.locator('.stk__row').nth(1)).toHaveAttribute('data-open', 'true');
      await tabs.nth(2).click();
      await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
      await expect(stk.locator('.stk__chip').first()).toHaveText(p.thirdFirstChip);
    });
  }

  test('without JavaScript each post shows one plain table per stack', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    for (const p of POSTS) {
      await page.goto(`/blog/${p.slug}/`);
      await expect(page.locator('figure.fig--stacks .stk')).toBeHidden();
      await expect(page.locator('figure.fig--stacks .stk-nojs table')).toHaveCount(3);
      await expect(page.locator('figure.fig--stacks .stk-nojs table').first().locator('tbody tr')).toHaveCount(p.rows);
      await expect(page.locator('.prose-dg table:visible')).toHaveCount(p.tables + 3);
    }
    await ctx.close();
  });
});
