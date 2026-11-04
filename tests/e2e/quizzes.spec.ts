import { expect, test, type Page } from '@playwright/test';

/** Opens a card of the syntax map (same retry as tests/e2e/materials.spec.ts: the cards are in the static HTML before React hydrates). */
async function openNode(page: Page, id: string) {
  const node = page.locator(`.tg__node[data-id="${id}"]`);
  await expect(async () => {
    if ((await node.getAttribute('aria-expanded')) !== 'true') {
      await node.evaluate((el) => el.scrollIntoView({ block: 'center' }));
      await node.click({ force: true });
    }
    await expect(node).toHaveAttribute('aria-expanded', 'true', { timeout: 1500 });
  }).toPass({ timeout: 20_000 });
}

test.describe('code quizzes', () => {
  test('a folder tile on the Materials index, three track tiles inside', async ({ page }) => {
    await page.goto('/materials/');
    const tile = page.locator('.tg__tile', { hasText: 'Code Quizzes' });
    await expect(tile).toContainText('3 tracks');
    await tile.click();
    await page.waitForURL(/\/materials\/quizzes\/$/);
    await expect(page.locator('h1')).toHaveText('Code Quizzes');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/materials\/quizzes\/$/);
    const tiles = page.locator('.tg__tile');
    await expect(tiles).toHaveCount(3);
    await expect(tiles.nth(0)).toContainText('JavaScript');
    await expect(tiles.nth(0)).toContainText('12 patterns');
    await expect(tiles.nth(0).locator('img')).toHaveAttribute('src', /\/logos\/javascript\.svg$/);
    await expect(tiles.nth(1)).toContainText('React');
    await expect(tiles.nth(2)).toContainText('SQL');
    await expect(tiles.nth(2)).toContainText('13 patterns');
    await tiles.nth(0).click();
    await page.waitForURL(/\/materials\/quizzes\/javascript\/$/);
  });

  test('the JavaScript lab: syntax map with code in the panel, then twenty questions graded at the end, with the review opening cards on the map', async ({ page }) => {
    test.slow(); // twenty questions with assertions on every screen: triple the timeout for loaded machines
    await page.goto('/materials/quizzes/javascript/');
    await expect(page.locator('h1')).toHaveText(/JavaScript/);
    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute('href', /\/es\/materials\/quizzes\/javascript\/$/);
    await expect(page.locator('.tg__tool')).toHaveCount(3);
    await expect(page.locator('.tg__tool[aria-current="page"]')).toContainText('JavaScript');
    await expect(page.locator('.tg__core img')).toHaveAttribute('src', /\/logos\/javascript\.svg$/);
    await expect(page.locator('.tg__node')).toHaveCount(12);
    await expect(page.locator('.tg__node .tg__icon svg')).toHaveCount(12);
    await openNode(page, 'event-loop');
    const panel = page.locator('#tg-panel');
    await expect(panel).toHaveAttribute('data-state', 'open');
    await expect(panel.locator('#tg-panel-title')).toHaveText('Event loop order');
    await expect(panel.locator('.tg__group')).toHaveText('Async');
    await expect(panel.locator('.tg__code')).toContainText('// A D C B');
    expect(await panel.locator('.tg__code').evaluate((el) => getComputedStyle(el).whiteSpace)).toBe('pre-wrap');
    await expect(panel.locator('.tg__ex--code')).toContainText('await null');
    await expect(panel.locator('dd')).toHaveCount(4); // when, what, watch out, example
    await page.keyboard.press('Escape');
    await expect(panel).toHaveAttribute('data-state', 'empty');

    // the quiz: start, answer all twenty, finish, review
    const qz = page.locator('.qz');
    await expect(qz).toHaveAttribute('data-phase', 'start');
    await expect(page.locator('.qzsec__intro')).toContainText('20 multiple-choice questions drawn at random from the 40');
    await expect(qz).toContainText('Pick an answer, move freely between the questions');
    await qz.getByRole('button', { name: 'Start the quiz' }).click();
    await expect(qz).toHaveAttribute('data-phase', 'run');
    await expect(qz.locator('.qz__dot')).toHaveCount(20);
    await expect(qz.locator('.qz__status')).toHaveText('20 unanswered');
    for (let i = 0; i < 20; i++) {
      await expect(qz.locator('.qz__head')).toContainText(`Question ${i + 1} of 20`);
      await expect(qz.locator('.qz__chip')).not.toBeEmpty();
      await expect(qz.locator('.qz__opt')).toHaveCount(4);
      await qz.locator('.qz__opt').nth(i % 4).click();
      await expect(qz.locator('.qz__opt[data-checked]')).toHaveCount(1);
      await expect(qz.locator('.qz__dot[data-done]')).toHaveCount(i + 1);
      if (i < 19) await qz.getByRole('button', { name: 'Next' }).click();
    }
    await expect(qz.getByRole('button', { name: 'Next' })).toBeDisabled();
    await expect(qz.locator('.qz__status')).toHaveText('All answered');
    await qz.locator('.qz__dot').nth(4).click(); // the navigator jumps back, the pick is kept
    await expect(qz.locator('.qz__head')).toContainText('Question 5 of 20');
    await expect(qz.locator('.qz__opt[data-checked]')).toHaveCount(1);
    await qz.getByRole('button', { name: 'Finish and grade' }).click();
    await expect(qz).toHaveAttribute('data-phase', 'done');
    await expect(qz.locator('.qz__ring strong')).toHaveText(/^\d{1,3}%$/);
    await expect(qz.locator('.qz__line')).toHaveText(/^\d{1,2} of 20 correct$/);
    await expect(qz.locator('.qz__level')).not.toBeEmpty();
    await qz.getByRole('button', { name: 'Review the answers' }).click();
    const items = qz.locator('.qz__review > li');
    await expect(items).toHaveCount(20);
    await expect(items.locator('dd[data-mark="right"]')).toHaveCount(20);
    const wrong = await items.locator('dd[data-mark="wrong"]').count();
    const score = Number((await qz.locator('.qz__line').innerText()).split(' ')[0]);
    expect(score + wrong).toBe(20);
    // every review entry opens its pattern on the map
    const first = items.first().locator('.qz__map');
    const title = await first.locator('span').innerText();
    await first.click();
    await expect(panel).toHaveAttribute('data-state', 'open');
    await expect(panel.locator('#tg-panel-title')).toHaveText(title);
    // a fresh draw
    await qz.getByRole('button', { name: 'New set of 20' }).click();
    await expect(qz).toHaveAttribute('data-phase', 'run');
    await expect(qz.locator('.qz__head')).toContainText('Question 1 of 20');
    await expect(qz.locator('.qz__opt[data-checked]')).toHaveCount(0);
  });

  test('the SQL lab in Spanish: thirteen cards, the window-function card, Spanish quiz strings', async ({ page }) => {
    await page.goto('/es/materials/quizzes/sql/');
    await expect(page.locator('h1')).toHaveText(/SQL \(Snowflake\)/);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', /\/materials\/quizzes\/sql\/$/);
    await expect(page.locator('.tg__tool[aria-current="page"]')).toContainText('SQL');
    await expect(page.locator('.tg__core img')).toHaveAttribute('src', /\/logos\/snowflake\.svg$/);
    await expect(page.locator('.tg__node')).toHaveCount(13);
    await expect(page.locator('.tg__spark')).toHaveCount(13);
    await openNode(page, 'window-over');
    const panel = page.locator('#tg-panel');
    await expect(panel.locator('#tg-panel-title')).toHaveText('Funciones de ventana y OVER()');
    await expect(panel.locator('.tg__group')).toHaveText('Funciones de ventana');
    await expect(panel.locator('.tg__code')).toContainText('AVG(salary) OVER (PARTITION BY department)');
    await expect(panel.locator('.tg__dl dt').first()).toHaveText('Cuándo usarlo');
    const qz = page.locator('.qz');
    await qz.getByRole('button', { name: 'Empezar el quiz' }).click();
    await expect(qz.locator('.qz__head')).toContainText('Pregunta 1 de 20');
    await expect(qz.locator('.qz__status')).toHaveText('20 sin responder');
  });

  test('the React lab on a phone keeps the thirteen-card layout rule out of the way: twelve cards in two columns', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'phone layout only');
    await page.goto('/materials/quizzes/react/');
    await expect(page.locator('.tg__node')).toHaveCount(12);
    await openNode(page, 'use-state');
    const gap = await page.locator('.tg').evaluate((el) => { const s = el.querySelector('.tg__stage')!.getBoundingClientRect(), p = document.querySelector('#tg-panel')!.getBoundingClientRect(); return p.top - s.bottom; });
    expect(gap).toBeGreaterThanOrEqual(-1); // the panel sits below the map on phones
  });

  test('without JavaScript the cheatsheet is a readable list with code blocks and the quiz says so', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto('/materials/quizzes/react/');
    await expect(page.locator('.tglist li')).toHaveCount(12);
    await expect(page.locator('.tglist h3 .tg__icon svg')).toHaveCount(12);
    await expect(page.locator('.tglist .tglist__code')).toHaveCount(12);
    await expect(page.locator('.tglist .tg__ex--code')).toHaveCount(12);
    await expect(page.locator('.tglist .tglist__code').first()).toContainText('function User({ name, age = 0, children })');
    expect(await page.locator('.tglist').evaluate((el) => getComputedStyle(el).display)).not.toBe('none');
    expect(await page.locator('.tg').evaluate((el) => getComputedStyle(el).display)).toBe('none');
    expect(await page.locator('.qz__nojs').evaluate((el) => getComputedStyle(el).display)).toBe('block');
    expect(await page.locator('.qz__cta').evaluate((el) => getComputedStyle(el).display)).toBe('none');
    await ctx.close();
  });
});
