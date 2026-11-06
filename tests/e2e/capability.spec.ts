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
    const spokes = b.locator('.brain__spoke');
    const spokeClosed = await spokes.nth(0).evaluate((e) => parseFloat(getComputedStyle(e).width)); // 222 px on desktop, 124 px on a phone
    await ai.click({ force: true }); // force: the gentle float animation never lets Playwright's stability check pass
    await expect(ai).toHaveAttribute('aria-expanded', 'true');
    const icons = b.locator('.brain__icon');
    await expect(icons).toHaveCount(21); // the LLM vendors (Mistral, Meta Llama, Qwen, DeepSeek, Microsoft Decision-1) and Microsoft Foundry joined the agent tools
    await expect(b.locator('.brain__icon[aria-label="LangGraph"]')).toBeVisible();
    await expect(b.locator('.brain__icon[aria-label="Grok (xAI)"]')).toBeVisible();
    await expect(b.locator('.brain__icon[aria-label="Meta Llama"]')).toBeVisible();
    await expect(b.locator('.brain__icon[aria-label="Microsoft Decision-1"]')).toBeVisible();
    await expect.poll(() => icons.locator('img').evaluateAll((imgs) => imgs.every((i) => (i as HTMLImageElement).naturalWidth > 0)), { timeout: 10000 }).toBe(true);
    expect(logoRequests.length).toBeGreaterThan(0);
    // the expanded node sits at the centre of the map
    await page.waitForTimeout(600);
    const mb = (await b.boundingBox())!, nb = (await ai.boundingBox())!;
    expect(Math.abs(nb.x + nb.width / 2 - (mb.x + mb.width / 2))).toBeLessThan(6);
    // twenty or more marks alternate between two rings, and no two of them overlap
    await expect(b).toHaveAttribute('data-dense', '');
    const boxes = await icons.evaluateAll((els) => els.map((e) => e.getBoundingClientRect()).map((r) => [r.x + r.width / 2, r.y + r.height / 2, r.width]));
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      const d = Math.hypot(boxes[i][0] - boxes[j][0], boxes[i][1] - boxes[j][1]);
      expect(d, `marks ${i} and ${j} overlap`).toBeGreaterThan((boxes[i][2] + boxes[j][2]) / 2 * 0.9);
    }
    // the connector pulse slides along its rotated connector (transform), never along the page's x-axis (the individual translate property)
    const pulse = await icons.nth(1).evaluate((e) => { const cs = getComputedStyle(e, '::after'); return { translate: cs.translate, anim: cs.animationName }; });
    expect(pulse.translate).toBe('none');
    // the spokes stretch to the nodes that stepped outward; the open node's own spoke fades
    await expect.poll(() => spokes.nth(0).evaluate((e) => parseFloat(getComputedStyle(e).width))).toBeGreaterThan(spokeClosed + 30);
    await expect(b.locator('.brain__spoke[data-active]')).toHaveCount(1);
    await expect.poll(() => b.locator('.brain__spoke[data-active]').evaluate((e) => getComputedStyle(e).opacity)).toBe('0');

    await page.keyboard.press('Escape');
    await expect(icons).toHaveCount(0);
    await expect(ai).toHaveAttribute('aria-expanded', 'false');

    await b.locator('.brain__node[data-id="data"]').click({ force: true }); // the busiest node: twenty-four tools, two rings
    await expect(icons).toHaveCount(24);
    await expect(b.locator('.brain__icon[aria-label="Snowflake"]')).toBeVisible();
    await expect(b.locator('.brain__icon[aria-label="Databricks"]')).toBeVisible();
    await expect(b.locator('.brain__icon[aria-label="Microsoft Fabric"]')).toBeVisible();
    await expect(b.locator('.brain__icon[aria-label="Azure AI Search"]')).toBeVisible();
    await page.keyboard.press('Escape'); // collapse before the next click: a forced click on a node still gliding can miss it on phones
    await expect(icons).toHaveCount(0);
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
