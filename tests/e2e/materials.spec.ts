import { expect, test, type Page } from '@playwright/test';

/** Opens a technique card. The cards are in the static HTML before React hydrates, so a single click can land too early; retry until the card reports itself expanded. */
async function openNode(page: Page, id: string) {
  const node = page.locator(`.tg__node[data-id="${id}"]`);
  await expect(async () => {
    if ((await node.getAttribute('aria-expanded')) !== 'true') { // never click an open card: a second click would close it again
      await node.evaluate((el) => el.scrollIntoView({ block: 'center' })); // a minimal scroll can leave the card under the fixed header, where a forced click lands on the header
      await node.click({ force: true });
    }
    await expect(node).toHaveAttribute('aria-expanded', 'true', { timeout: 1500 });
  }).toPass({ timeout: 20_000 }); // generous: hydration and renders are slower when the machine is busy
}

test.describe('materials', () => {
  test('index lists the tools; the nav item sits right before the CV link', async ({ page, isMobile }) => {
    await page.goto('/materials/');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/materials\/$/);
    await expect(page.locator('.tg__tile')).toHaveCount(7); // Claude, AEO, GEO, KPIs, SEO + the Videos and Code Quizzes folders
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
    await expect(panel.locator('dd')).toHaveCount(4); // when, what, why, example
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

  test('the AEO and GEO maps: an icon on every card, study figures in the panel, Spanish', async ({ page }) => {
    await page.goto('/materials/aeo/');
    await expect(page.locator('h1')).toHaveText(/AEO/);
    await expect(page.locator('.tg__tool[aria-current="page"]')).toContainText('AEO');
    const g = page.locator('.tg');
    await expect(g.locator('.tg__node')).toHaveCount(10);
    await expect(g.locator('.tg__node .tg__icon svg')).toHaveCount(10);
    await expect(g.locator('.tg__core img')).toHaveAttribute('src', /\/logos\/aeo\.svg$/);
    await openNode(page, 'comparison-tables');
    const panel = page.locator('#tg-panel');
    await expect(panel).toHaveAttribute('data-state', 'open');
    await expect(panel.locator('#tg-panel-title')).toHaveText('Comparison tables');
    await expect(panel.locator('#tg-panel-title .tg__icon svg')).toHaveCount(1);
    await expect(panel.locator('.tg__chip[data-kind="study"]')).toContainText(/Reported lift: Cited 4\.2× more often .* \(published study\)/);
    await expect(panel.locator('.tg__group')).toHaveText('Structure');
    await expect(panel.locator('.tg__ex')).toContainText('Starter costs €99/month'); // the example, with its line breaks kept
    expect(await panel.locator('.tg__ex').evaluate((el) => getComputedStyle(el).whiteSpace)).toBe('pre-line');
    await page.goto('/materials/geo/');
    await expect(page.locator('.tg__node')).toHaveCount(11);
    await expect(page.locator('.tg__core img')).toHaveAttribute('src', /\/logos\/geo\.svg$/);
    await openNode(page, 'cite-evidence');
    await expect(panel.locator('.tg__chip[data-kind="study"]')).toContainText('+40 % visibility with citations');
    await openNode(page, 'measure');
    await expect(panel.locator('.tg__chip[data-kind="estimate"]')).toContainText(/30–45 days \(estimate\)/);
    await expect(panel.locator('.tg__group')).toHaveText('Measurement');
    await expect(page.locator('.tg__sources')).toContainText('Princeton');
    // "How do LLMs rank content?": a real table, five rows from 4.2× down to the 1.0× baseline, bars grow once scrolled into view
    const cr = page.locator('.cr');
    await expect(cr.locator('h2')).toHaveText('How do LLMs rank content?');
    await expect(cr.locator('table thead th')).toHaveCount(3);
    const rows = cr.locator('table tbody tr');
    await expect(rows).toHaveCount(5);
    await expect(rows.first()).toContainText(/Table.*4\.2×/);
    await expect(rows.last()).toContainText(/Prose paragraph.*1\.0× baseline/);
    await cr.scrollIntoViewIfNeeded();
    await expect(cr).toHaveAttribute('data-inview', '');
    await expect.poll(async () => rows.first().locator('.cr__fill').evaluate((el) => getComputedStyle(el).transform), { timeout: 5000 }).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
    expect(await rows.nth(1).locator('.cr__fill').evaluate((el) => el.getBoundingClientRect().width / el.parentElement!.getBoundingClientRect().width)).toBeCloseTo(3.1 / 4.2, 1);
    await page.goto('/es/materials/geo/');
    await expect(page.locator('h1')).toHaveText(/GEO: 11 técnicas/);
    await expect(page.locator('.tg__node[data-id="measure"] .tg__title')).toHaveText('Mide las citas como una evaluación');
    await expect(page.locator('.cr h2')).toHaveText('¿Cómo clasifican el contenido los LLM?');
    await expect(page.locator('.cr table tbody tr').first()).toContainText('4,2×');
  });

  test('the KPIs map: twelve cards in four groups and the tools table', async ({ page }) => {
    await page.goto('/materials/kpis/');
    await expect(page.locator('h1')).toHaveText(/AI Search KPIs/);
    await expect(page.locator('.tg__tool')).toHaveCount(5);
    await expect(page.locator('.tg__tool[aria-current="page"]')).toContainText('KPIs');
    await expect(page.locator('.tg__node')).toHaveCount(12);
    await expect(page.locator('.tg__node .tg__icon svg')).toHaveCount(12);
    await openNode(page, 'llm-traffic');
    const panel = page.locator('#tg-panel');
    await expect(panel.locator('.tg__group')).toHaveText('Metrics');
    await expect(panel.locator('.tg__chip[data-kind="study"]')).toContainText('37 %');
    await expect(panel.locator('.tg__ex')).toContainText('GA4');
    const cr = page.locator('.cr');
    await expect(cr).toHaveCount(1);
    await expect(cr.locator('h2')).toHaveText('Which AI visibility tool, when?');
    await expect(cr.locator('table thead th')).toHaveCount(4);
    await expect(cr.locator('table tbody tr')).toHaveCount(12);
    await expect(cr.locator('table tbody tr').first()).toContainText('KIME');
    await expect(cr.locator('.cr__fill')).toHaveCount(0); // no bars on this table
    await page.goto('/es/materials/kpis/');
    await expect(page.locator('h1')).toHaveText(/KPIs de búsqueda con IA/);
    await expect(page.locator('.cr h2')).toHaveText('¿Qué herramienta de visibilidad en IA y cuándo?');
  });

  test('the SEO map: twelve classic practices and the SEO vs AI search table', async ({ page }) => {
    await page.goto('/materials/seo/');
    await expect(page.locator('h1')).toHaveText(/SEO: 12 Content-Structure Practices/);
    await expect(page.locator('.tg__tool[aria-current="page"]')).toContainText('SEO');
    await expect(page.locator('.tg__node')).toHaveCount(12);
    await expect(page.locator('.tg__node .tg__icon svg')).toHaveCount(12);
    await openNode(page, 'readable-urls');
    const panel = page.locator('#tg-panel');
    await expect(panel.locator('.tg__group')).toHaveText('On-page');
    await expect(panel.locator('.tg__ex')).toContainText('BreadcrumbList');
    await expect(panel.locator('.tg__chip')).toHaveCount(0); // no figures claimed on this map
    const cr = page.locator('.cr');
    await expect(cr).toHaveCount(1);
    await expect(cr.locator('h2')).toHaveText('Content structure for SEO vs AI search');
    await expect(cr.locator('table thead th')).toHaveCount(3);
    await expect(cr.locator('table tbody tr')).toHaveCount(4);
    await expect(cr.locator('table tbody tr').last()).toContainText(/Structure job.*Hierarchy and keyword clarity.*Quotable, standalone sections/);
    await page.goto('/es/materials/seo/');
    await expect(page.locator('h1')).toHaveText(/SEO: 12 prácticas/);
    await expect(page.locator('.cr h2')).toHaveText('Estructura de contenido para SEO frente a búsqueda con IA');
  });

  test('videos: a folder tile on the index, five cards inside, each page plays its Loom on click, the proposal short link redirects', async ({ page }) => {
    await page.goto('/materials/');
    const tile = page.locator('.tg__tile', { hasText: 'Videos' });
    await tile.click();
    await page.waitForURL(/\/materials\/videos\/$/);
    await expect(page.locator('h1')).toHaveText('Videos');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/materials\/videos\/$/);
    const cards = page.locator('.vcard');
    await expect(cards).toHaveCount(5);
    await expect(cards.first()).toContainText('Data Science');
    await expect(cards.first().locator('.vcard__time')).toHaveText('2:24');
    await cards.nth(1).click();
    await page.waitForURL(/\/materials\/videos\/genai\/$/);
    await expect(page.locator('h1')).toHaveText('Generative AI');
    await expect(page).toHaveTitle(/Generative AI: Video Introduction/);
    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute('href', /\/es\/materials\/videos\/genai\/$/);
    const facade = page.locator('.vplayer .facade');
    await expect(facade.locator('img')).toHaveAttribute('src', /genai/); // a still frame of the recording, not the generic Loom tile
    await expect(facade.locator('iframe')).toHaveCount(0);
    await facade.getByRole('button').click();
    await expect(facade.locator('iframe')).toHaveAttribute('src', /loom\.com\/embed\/92cd7dca2c74443cad0aefc50876b5f6/);
    await expect(page.locator('.vmeta a[href="https://www.loom.com/share/92cd7dca2c74443cad0aefc50876b5f6"]')).toBeVisible();
    await expect(page.locator('.vmeta code')).toHaveText(/\/GenAI$/);
    await expect(page.locator('.vcats a')).toHaveCount(2);
    await expect(page.locator('.vcats a').first()).toHaveAttribute('href', /\/portfolio\/#f-ai-agents$/);
    await expect(page.locator('.vprojects [data-testid="project-card"]')).toHaveCount(3);
    await expect(page.locator('.vcards .vcard')).toHaveCount(4); // the other four videos
    // the short link sent in proposals is a static redirect page to this video (GitHub Pages cannot 301)
    const r = await page.request.get('/GenAI/');
    expect(r.ok()).toBeTruthy();
    const html = await r.text();
    expect(html).toContain('content="0; url=/materials/videos/genai/"');
    expect(html).toMatch(/<link rel="canonical" href="https?:\/\/[^"]+\/materials\/videos\/genai\/"/);
    await page.goto('/es/materials/videos/genai/');
    await expect(page.locator('h1')).toHaveText('IA generativa');
    await expect(page.locator('.vcard').first()).toContainText('Ciencia de datos');
  });

  test('reduced motion hides the travelling sparks', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/materials/claude/');
    expect(await page.locator('.tg__spark').first().evaluate((el) => getComputedStyle(el).display)).toBe('none');
    await page.goto('/materials/aeo/');
    expect(await page.locator('.cr__fill').first().evaluate((el) => getComputedStyle(el).transform)).toBe('none'); // bars are not collapsed when motion is off
  });

  test('without JavaScript the techniques are a readable list', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto('/materials/claude/');
    await expect(page.locator('.tglist li')).toHaveCount(12);
    await page.goto('/materials/geo/');
    await expect(page.locator('.tglist li')).toHaveCount(11);
    await expect(page.locator('.tglist h3 .tg__icon svg')).toHaveCount(11);
    await expect(page.locator('.tglist .tg__ex')).toHaveCount(11);
    await expect(page.locator('.cr table tbody tr')).toHaveCount(5); // the table is plain HTML: present without JS, bars at their final size
    expect(await page.locator('.cr__fill').first().evaluate((el) => getComputedStyle(el).transform)).toBe('none');
    expect(await page.locator('.tglist').evaluate((el) => getComputedStyle(el).display)).not.toBe('none');
    expect(await page.locator('.tg').evaluate((el) => getComputedStyle(el).display)).toBe('none');
    await ctx.close();
  });
});
