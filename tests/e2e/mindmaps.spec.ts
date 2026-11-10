import { expect, test, type Page } from '@playwright/test';

const card = (page: Page, id: string) => page.locator(`.react-flow__node[data-id="${id}"]`);
/** Clicks a card after centring it: a minimal scroll can leave it under the fixed header, where the click lands on the header (same guard as materials.spec.ts). */
async function tap(page: Page, id: string, times: 1 | 2 = 1) {
  const c = card(page, id);
  await c.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' })); // instant: the page scrolls smoothly otherwise and the card is never "stable"
  if (times === 2) await c.dblclick({ force: true }); else await c.click({ force: true });
}
const START = 21; // the root, eight branches and the twelve Cortex concepts open at start
const DBX_START = 19; // the root, eight branches and the ten platform capabilities open at start

test.describe('mind maps', () => {
  test('a folder tile on the Materials index, the Snowflake and Databricks tiles inside', async ({ page }) => {
    await page.goto('/materials/');
    const tile = page.locator('.tg__tile', { hasText: 'Mind Maps' });
    await expect(tile).toContainText('3 maps');
    await tile.click();
    await page.waitForURL(/\/materials\/mindmaps\/$/);
    await expect(page.locator('h1')).toHaveText('Mind Maps');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/materials\/mindmaps\/$/);
    const tiles = page.locator('.tg__tile');
    await expect(tiles).toHaveCount(3);
    await expect(tiles.first()).toContainText('Snowflake');
    await expect(tiles.first()).toContainText('8 branches · 73 concepts');
    await expect(tiles.first().locator('img')).toHaveAttribute('src', /\/logos\/snowflake\.svg$/);
    await expect(tiles.nth(1)).toContainText('Databricks');
    await expect(tiles.nth(1)).toContainText('8 branches · 88 concepts');
    await expect(tiles.nth(1).locator('img')).toHaveAttribute('src', /\/logos\/databricks\.svg$/);
    await tiles.first().click();
    await page.waitForURL(/\/materials\/mindmaps\/snowflake\/$/);
  });

  test('the Databricks map: the platform branch open at start, a figure with its lesson, nested folds, Spanish, no JavaScript', async ({ page, browser }) => {
    await page.goto('/materials/mindmaps/databricks/');
    await expect(page.locator('h1')).toHaveText(/Databricks Mind Map/);
    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute('href', /\/es\/materials\/mindmaps\/databricks\/$/);
    await expect(page.locator('.tg__tool')).toHaveCount(3); // the switcher lists every map
    await expect(page.locator('.tg__tool[aria-current="page"]')).toContainText('Databricks');
    const nodes = page.locator('.react-flow__node');
    await expect(nodes).toHaveCount(DBX_START, { timeout: 20_000 });
    await expect(page.locator('.react-flow__node-root img')).toHaveAttribute('src', /\/logos\/databricks\.svg$/);
    await expect(card(page, 'plat-roadmap').locator('.mm__badge')).toHaveText('5'); // the toolset stays folded inside the open branch
    const panel = page.locator('#tg-panel');
    await tap(page, 'plat-photon');
    await expect(panel).toHaveAttribute('data-state', 'open');
    await expect(panel.locator('#tg-panel-title')).toHaveText('Photon');
    await expect(panel.locator('.tg__group')).toHaveText('Databricks platform');
    await expect(panel.locator('.mm__facts li').first()).toContainText('Source: How to create Spark Cluster');
    await card(page, 'nb').locator('.mm__badge').click();
    await expect(nodes).toHaveCount(DBX_START + 6); // six direct children; magic commands and dbutils keep theirs folded
    await expect(card(page, 'nb-magic').locator('.mm__badge')).toHaveText('5');
    // the unfold is still animating the layout, so a forced click at the card's old position can miss: retry until it lands
    await expect(async () => {
      await tap(page, 'nb-dbutils');
      await expect(panel.locator('#tg-panel-title')).toHaveText('Databricks Utilities (dbutils)', { timeout: 1_000 });
    }).toPass({ timeout: 15_000 });
    await expect(panel.locator('.tg__code')).toContainText('dbutils.fs.help()');
    await page.keyboard.press('Escape');
    await expect(panel).toHaveAttribute('data-state', 'empty');
    await expect(page.locator('.tg__sources')).toContainText('Packt');

    await page.goto('/es/materials/mindmaps/databricks/');
    await expect(page.locator('h1')).toHaveText(/Mapa mental de Databricks/);
    await expect(page.locator('.react-flow__node')).toHaveCount(DBX_START, { timeout: 20_000 });
    await tap(page, 'plat-unity');
    await expect(page.locator('#tg-panel .tg__group')).toHaveText('Plataforma Databricks');
    await expect(page.locator('#tg-panel-title')).toHaveText('Unity Catalog');

    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const p = await ctx.newPage();
    await p.goto('/materials/mindmaps/databricks/');
    await expect(p.locator('.mmlist h3')).toHaveCount(88);
    await expect(p.locator('.mmlist > li')).toHaveCount(8);
    await expect(p.locator('.mmlist .tglist__code', { hasText: 'dbutils.fs.mount' })).toHaveCount(1);
    await ctx.close();
  });

  test('the LLM map: the VRAM branch open at start, a figure with its source, the GPU tiers fold, Spanish, no JavaScript', async ({ page, browser }) => {
    await page.goto('/materials/mindmaps/llms/');
    await expect(page.locator('h1')).toHaveText(/LLM Cheatsheet Mind Map/);
    await expect(page.locator('.tg__tool[aria-current="page"]')).toContainText('LLMs');
    const nodes = page.locator('.react-flow__node');
    await expect(nodes).toHaveCount(17, { timeout: 20_000 }); // the root, eight branches and the eight VRAM concepts
    await expect(card(page, 'vram-tiers').locator('.mm__badge')).toHaveText('7');
    const panel = page.locator('#tg-panel');
    await tap(page, 'vram-kv');
    await expect(panel.locator('#tg-panel-title')).toHaveText('KV cache');
    await expect(panel.locator('.mm__facts li').first()).toContainText('Source: NVIDIA blog');
    await expect(panel.locator('.tg__code').first()).toContainText('kv_heads');
    await page.keyboard.press('Escape');
    await card(page, 'vram-tiers').locator('.mm__badge').click();
    await expect(nodes).toHaveCount(17 + 7);

    await page.goto('/es/materials/mindmaps/llms/');
    await expect(page.locator('h1')).toHaveText(/Mapa mental de LLM/);
    await expect(page.locator('.react-flow__node')).toHaveCount(17, { timeout: 20_000 });
    await tap(page, 'vram-moe');
    await expect(page.locator('#tg-panel-title')).toHaveText('La trampa de memoria del MoE');

    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const p = await ctx.newPage();
    await p.goto('/materials/mindmaps/llms/');
    await expect(p.locator('.mmlist h3')).toHaveCount(94);
    await expect(p.locator('.mmlist > li')).toHaveCount(8);
    await ctx.close();
  });

  test('the Snowflake map: the Cortex branch open at start, details panel, fold and unfold, Escape', async ({ page }) => {
    await page.goto('/materials/mindmaps/snowflake/');
    await expect(page.locator('h1')).toHaveText(/Snowflake Mind Map/);
    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute('href', /\/es\/materials\/mindmaps\/snowflake\/$/);
    await expect(page.locator('.tg__tool[aria-current="page"]')).toContainText('Snowflake');
    const nodes = page.locator('.react-flow__node');
    await expect(nodes).toHaveCount(START, { timeout: 20_000 }); // React Flow loads after hydration
    await expect(page.locator('.react-flow__node-root img')).toHaveAttribute('src', /\/logos\/snowflake\.svg$/);
    await expect(page.locator('.mm__card[data-kind="ai"]')).toHaveCount(13);
    await expect(card(page, 'ai-complete').locator('.mm__logo')).toHaveAttribute('src', /\/logos\/mistral\.svg$/);
    await expect(page.locator('.mm__legend li')).toHaveCount(7);
    const panel = page.locator('#tg-panel');
    await expect(panel).toHaveAttribute('data-state', 'empty');
    await tap(page, 'ai-search');
    await expect(panel).toHaveAttribute('data-state', 'open');
    await expect(panel.locator('#tg-panel-title')).toHaveText('Cortex Search');
    await expect(panel.locator('.tg__group')).toHaveText('AI with Cortex');
    await expect(panel.locator('.tg__code')).toContainText('CREATE CORTEX SEARCH SERVICE');
    await expect(panel.locator('.mm__ai')).toContainText('RAG');
    await expect(page.locator('.react-flow__edge.mm__edge--lit')).toHaveCount(2); // root → AI with Cortex → Cortex Search
    // fold the Cortex branch (its selected card goes with it), unfold Core objects
    await card(page, 'ai').locator('.mm__badge').click();
    await expect(nodes).toHaveCount(9);
    await expect(panel).toHaveAttribute('data-state', 'empty');
    await expect(card(page, 'ai').locator('.mm__badge')).toHaveText('12');
    await card(page, 'core').locator('.mm__badge').click();
    await expect(nodes).toHaveCount(19); // ten direct children; the warehouse keeps its three folded
    await expect(card(page, 'core-warehouse').locator('.mm__badge')).toHaveText('3');
    // the unfold is still animating the layout, so a forced click at the card's old position can miss: retry until it lands
    await expect(async () => {
      await tap(page, 'core-warehouse');
      await expect(panel.locator('#tg-panel-title')).toHaveText('Virtual warehouse', { timeout: 1_000 });
    }).toPass({ timeout: 15_000 });
    await expect(panel.locator('.tg__group')).toHaveText('Core objects');
    await expect(panel.locator('.mm__facts li')).toHaveCount(3);
    await expect(panel.locator('.mm__facts li').first()).toContainText('Source: Virtual Warehouses');
    await page.keyboard.press('Escape');
    await expect(panel).toHaveAttribute('data-state', 'empty');
    await expect(page.locator('.tg__sources')).toContainText('Coursera');
  });

  test('edit mode: rename, delete, add, copy, reset', async ({ page }) => {
    await page.goto('/materials/mindmaps/snowflake/');
    const nodes = page.locator('.react-flow__node');
    await expect(nodes).toHaveCount(START, { timeout: 20_000 });
    await expect(page.locator('.mm')).not.toHaveAttribute('data-edit', '');
    await page.getByRole('button', { name: 'Edit the map' }).click();
    await expect(page.locator('.mm')).toHaveAttribute('data-edit', '');
    await tap(page, 'ai-search', 2);
    const input = card(page, 'ai-search').locator('input');
    await expect(input).toBeFocused();
    await input.fill('Semantic search');
    await input.press('Enter');
    await expect(card(page, 'ai-search').locator('.mm__title')).toHaveText('Semantic search');
    await tap(page, 'ai-cli');
    await page.keyboard.press('Delete');
    await expect(nodes).toHaveCount(START - 1);
    await tap(page, 'ai');
    await page.getByRole('button', { name: 'Add concept' }).click();
    await expect(nodes).toHaveCount(START);
    const fresh = page.locator('.react-flow__node[data-id^="new-"]');
    await expect(fresh.locator('input')).toBeFocused();
    await fresh.locator('input').fill('Cortex Agents');
    await fresh.locator('input').press('Enter');
    await expect(fresh.locator('.mm__title')).toHaveText('Cortex Agents');
    await expect(fresh.locator('.mm__card')).toHaveAttribute('data-kind', 'ai'); // inherits the branch
    await page.getByRole('button', { name: 'Copy JSON' }).click();
    await expect(page.locator('.mm__status')).toHaveText(/Copied|Copy failed/);
    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(nodes).toHaveCount(START);
    await expect(card(page, 'ai-search').locator('.mm__title')).toHaveText('Cortex Search');
    await expect(card(page, 'ai-cli')).toHaveCount(1);
    await expect(fresh).toHaveCount(0);
    await page.getByRole('button', { name: 'Done editing' }).click();
    await expect(page.locator('.mm')).not.toHaveAttribute('data-edit', '');
  });

  test('Spanish, reduced motion, and the list without JavaScript', async ({ page, browser }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/es/materials/mindmaps/snowflake/');
    await expect(page.locator('h1')).toHaveText(/Mapa mental de Snowflake/);
    await expect(page.locator('.react-flow__node')).toHaveCount(START, { timeout: 20_000 });
    await tap(page, 'ai-search');
    await expect(page.locator('#tg-panel .tg__group')).toHaveText('IA con Cortex');
    await expect(page.locator('#tg-panel dt').first()).toHaveText('Qué es');
    const lit = page.locator('.react-flow__edge.mm__edge--lit path').first();
    expect(await lit.evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
    await expect(page.getByRole('button', { name: 'Editar el mapa' })).toBeVisible();

    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const p = await ctx.newPage();
    await p.goto('/materials/mindmaps/snowflake/');
    await expect(p.locator('.mmlist h3')).toHaveCount(73); // one heading per concept (the facts inside are lists too)
    await expect(p.locator('.mmlist > li')).toHaveCount(8);
    await expect(p.locator('.mmlist h3 .tg__icon svg, .mmlist h3 img')).toHaveCount(73);
    await expect(p.locator('.mmlist .tglist__code', { hasText: 'USE WAREHOUSE' })).toHaveCount(1);
    expect(await p.locator('.mmlist').evaluate((el) => getComputedStyle(el).display)).not.toBe('none');
    const canvases = await p.locator('.mm').count();
    if (canvases) expect(await p.locator('.mm').first().evaluate((el) => getComputedStyle(el).display)).toBe('none');
    await ctx.close();
  });
});
