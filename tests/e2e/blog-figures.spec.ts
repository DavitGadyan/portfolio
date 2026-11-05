import { expect, test } from '@playwright/test';

/** The Snowflake vs Databricks post: four GFM tables and three inline SVG diagrams (`<Figure/>` from content/diagrams/), in both locales. */
const cases = [
  ['/blog/snowflake-vs-databricks-use-cases/', 'Snowflake vs Databricks: Where the Use Cases Overlap and Where They Split', 'Figure 1.'],
  ['/es/blog/snowflake-vs-databricks-use-cases/', 'Snowflake vs Databricks: dónde coinciden los casos de uso y dónde se separan', 'Figura 1.'],
] as const;

test.describe('blog figures', () => {
  for (const [path, title, cap] of cases) {
    test(`${path} renders the tables and the three diagrams`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('h1')).toHaveText(title);
      await expect(page.locator('.prose-dg table')).toHaveCount(4);
      const figs = page.locator('.prose-dg figure.fig');
      await expect(figs).toHaveCount(3);
      await expect(figs.locator('svg[role="img"][aria-label]')).toHaveCount(3);
      await expect(figs.first().locator('figcaption')).toContainText(cap);
      await expect(figs.first().locator('svg text', { hasText: 'Snowgrid' })).toBeVisible();
      const box = await figs.first().locator('svg').boundingBox();
      expect(box !== null && box.width > 240 && box.height > 90).toBe(true); // the SVG scales with the column instead of collapsing
      await expect(page.locator('.prose-dg pre')).toHaveCount(2); // the two local-setup command blocks
      await expect(page.locator('.prose-dg img[src*="snowflake-cortex-ml-functions"]')).toHaveCount(1); // the course slide in the ML-exploration section
    });
  }
});
