import { expect, test } from '@playwright/test';

/** The Snowflake vs Databricks post: four GFM tables and three inline SVG diagrams (`<Figure/>` from content/diagrams/), in both locales. */
const cases = [
  ['/blog/snowflake-vs-databricks-use-cases/', 'Snowflake vs Databricks: Where the Use Cases Overlap and Where They Split', 'Figure 1.'],
  ['/es/blog/snowflake-vs-databricks-use-cases/', 'Snowflake vs Databricks: dónde coinciden los casos de uso y dónde se separan', 'Figura 1.'],
] as const;

/** The Azure / Fabric / Databricks / Foundry post: thirteen GFM tables, three SVG figures and two interactive stack diagrams (`<Stacks/>`). */
const azure = [
  ['/blog/azure-fabric-databricks-foundry-which-to-choose/', 'Azure, Fabric, Databricks or Foundry: Which Microsoft Service to Choose?', 'Figure 2.', 'Typical use', 'Cloud infrastructure', 'Data engineering'],
  ['/es/blog/azure-fabric-databricks-foundry-which-to-choose/', 'Azure, Fabric, Databricks o Foundry: ¿qué servicio de Microsoft elegir?', 'Figura 2.', 'Uso típico', 'Infraestructura en la nube', 'Ingeniería de datos'],
] as const;

test.describe('blog stack diagrams', () => {
  for (const [path, title, cap, use, infra, data] of azure) {
    test(`${path}: tables, figures, tabs and layers`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('h1')).toHaveText(title);
      await expect(page.locator('.prose-dg table:visible')).toHaveCount(13);
      await expect(page.locator('.prose-dg figure.fig svg[role="img"][aria-label]')).toHaveCount(3);
      const stacks = page.locator('.prose-dg figure.fig--stacks');
      await expect(stacks).toHaveCount(2);
      await expect(stacks.first().locator('figcaption')).toContainText(cap);
      await expect(stacks.first().locator('.stk-nojs')).toBeHidden(); // the plain tables are for readers without JavaScript
      const clouds = stacks.first().locator('.stk[data-diagram="clouds"]');
      await expect(clouds.locator('[role="tab"]')).toHaveCount(3);
      await expect(clouds.locator('[role="tab"][aria-selected="true"]')).toHaveText('Azure');
      await expect(clouds.locator('.stk__row')).toHaveCount(4);
      await expect(clouds.locator('.stk__chip').first()).toHaveText('Microsoft Foundry');
      await expect(clouds.locator('.stk__chip img').first()).toHaveAttribute('src', /foundry\.svg$/);
      await expect(clouds.locator('.stk__use')).toContainText(use);
      // tap a layer: its note opens; tap another: the first closes
      const infraRow = clouds.locator('.stk__row[data-layer="infra"]');
      await expect(infraRow.locator('.stk__lname')).toHaveText(infra);
      await infraRow.locator('.stk__layer').click();
      await expect(infraRow).toHaveAttribute('data-open', 'true');
      await expect(infraRow.locator('.stk__note')).toBeVisible();
      await clouds.locator('.stk__row[data-layer="data"] .stk__layer').click();
      await expect(infraRow.locator('.stk__note')).toBeHidden();
      await expect(clouds.locator('.stk__row[data-layer="data"] .stk__lname')).toHaveText(data);
      // switch to Google Cloud: the top layer names the renamed platform, keyboard moves the tabs too
      await clouds.locator('[role="tab"]', { hasText: 'Google Cloud' }).click();
      await expect(clouds.locator('[role="tab"][aria-selected="true"]')).toHaveText('Google Cloud');
      await expect(clouds.locator('.stk__chip').first()).toHaveText('Gemini Enterprise Agent Platform');
      await expect(clouds.locator('.stk__row[data-open]')).toHaveCount(0);
      await page.keyboard.press('ArrowRight');
      await expect(clouds.locator('[role="tab"][aria-selected="true"]')).toHaveText('Azure');
      // the five reference stacks
      const ref = stacks.nth(1).locator('.stk[data-diagram="stacks"]');
      await expect(ref.locator('[role="tab"]')).toHaveCount(5);
      await ref.locator('[role="tab"]', { hasText: 'Databricks + Foundry' }).first().click();
      await expect(ref.locator('.stk__row')).toHaveCount(11);
      await expect(ref.locator('.stk__row[data-layer="vectors"] .stk__chip')).toHaveCount(2);
    });
  }

  test('without JavaScript the stack diagrams render as plain tables', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto('/blog/azure-fabric-databricks-foundry-which-to-choose/');
    await expect(page.locator('.stk')).toHaveCount(2);
    await expect(page.locator('.stk').first()).toBeHidden();
    const tables = page.locator('.stk-nojs table');
    await expect(tables).toHaveCount(3 + 5);
    await expect(tables.first().locator('caption')).toContainText('Azure.');
    await expect(tables.first().locator('tbody tr')).toHaveCount(4);
    await expect(tables.first().locator('tbody tr').first().locator('td').first()).toContainText('Microsoft Foundry, Foundry Agent Service, Azure AI Search');
    await ctx.close();
  });
});

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
