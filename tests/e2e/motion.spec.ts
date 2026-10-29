import { expect, test } from '@playwright/test';

test.describe('home-page motion', () => {
  test('hero shows only the name, the typewriter title and the four KPI chips (no buttons)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#home h1')).toHaveText('David Gadyan');
    await expect(page.locator('#home .tw')).toBeVisible();
    await expect(page.locator('#home .hero-dot')).toHaveCount(4);
    await expect(page.locator('#home .btn, #home a[href="#book"], #home a[href="#contact"]')).toHaveCount(0);
  });

  test('skill bars: greyed out until hovered on pointer devices; fill on scroll (and replay) on touch devices', async ({ page, isMobile }) => {
    await page.goto('/');
    const group = page.locator('#about ul[data-reveal-group]');
    const first = group.locator('.skill').first();
    const fill = first.locator('.skillbar__fill');
    const width = () => fill.evaluate((el) => el.getBoundingClientRect().width);
    await group.scrollIntoViewIfNeeded();
    if (isMobile) {
      await expect.poll(width, { timeout: 5000 }).toBeGreaterThan(40);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await expect.poll(width, { timeout: 3000 }).toBe(0);
      await group.scrollIntoViewIfNeeded();
      await expect.poll(width, { timeout: 5000 }).toBeGreaterThan(40);
      return;
    }
    const num = first.locator('.skill__num');
    const numOpacity = () => num.evaluate((el) => getComputedStyle(el).opacity);
    await page.waitForTimeout(800);
    expect(await width()).toBe(0);
    expect(await numOpacity()).toBe('0');
    await first.hover();
    await expect.poll(width, { timeout: 4000 }).toBeGreaterThan(40);
    await expect.poll(numOpacity, { timeout: 2000 }).toBe('1');
    await expect.poll(() => num.evaluate((el) => getComputedStyle(el).getPropertyValue('--n').trim()), { timeout: 3000 }).toBe('95'); // the counter reached the skill's value
    await page.mouse.move(0, 0);
    await expect.poll(width, { timeout: 3000 }).toBe(0);
  });

  test('testimonial carousel: dots, keys, drag, touch swipe and trackpad wheel turn it; drift and hold', async ({ page, isMobile }) => {
    await page.goto('/');
    const region = page.locator('.ccar');
    await region.scrollIntoViewIfNeeded();
    const dots = region.locator('.carousel__dot');
    const current = () => dots.evaluateAll((els) => els.findIndex((e) => e.getAttribute('aria-current') === 'true'));
    const front = () => region.locator('.ccard[data-front]').getAttribute('aria-label');
    expect(await region.locator('.ccar__ctrl .btn').evaluateAll((els) => els.filter((e) => e.getBoundingClientRect().width > 2).length)).toBe(0); // only the sr-only pause toggle remains

    // wait for hydration (the script writes inline transforms on mount), then it drifts on its own
    await expect.poll(() => region.locator('.ccard[data-front]').evaluate((el) => (el as HTMLElement).style.transform), { timeout: 20000 }).not.toBe('');
    const start = await current();
    const diag = () => region.evaluate(async (el, start) => {
      const dots = [...el.querySelectorAll('.carousel__dot')];
      const cur = dots.findIndex((d) => d.getAttribute('aria-current') === 'true');
      const r = el.getBoundingClientRect();
      return { moved: cur !== start, cur, visibility: document.visibilityState, running: 'running' in el.dataset, hasFocus: document.hasFocus(), top: Math.round(r.top), vh: innerHeight, front: (el.querySelector('.ccard[data-front]') as HTMLElement).style.transform };
    }, start);
    await expect.poll(async () => JSON.stringify(await diag()), { timeout: 12000 }).toContain('"moved":true');

    // the hidden pause toggle holds it
    const pause = region.locator('button[aria-pressed]');
    await pause.focus();
    await pause.press('Enter');
    await expect(pause).toHaveAttribute('aria-pressed', 'true');
    await page.waitForTimeout(600);
    const i0 = await current();
    const at = (k: number) => dots.nth((((i0 + k) % 15) + 15) % 15);
    // a gesture may travel more than one card depending on its speed: assert the direction and a sane distance
    const moved = async (from: number, forward: boolean) => {
      await expect.poll(async () => { const d = (((await current()) - from) % 15 + 15) % 15; return forward ? d >= 1 && d <= 7 : d >= 8 && d <= 14; }, { timeout: 4000 }).toBe(true);
      return current();
    };

    await at(1).click();
    await expect(at(1)).toHaveAttribute('aria-current', 'true');
    expect(await front()).toBe(`${((i0 + 1) % 15) + 1} / 15`);

    await region.focus();
    await page.keyboard.press('ArrowRight');
    await expect(at(2)).toHaveAttribute('aria-current', 'true');

    const stage = region.locator('.ccar__stage');
    const box = (await stage.boundingBox())!;
    const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
    const step = (await region.locator('.ccard[data-front]').boundingBox())!.width * 0.6 * 0.9 / 10;
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    for (let i = 1; i <= 10; i++) { await page.mouse.move(cx - i * step, cy); await page.waitForTimeout(16); }
    await page.mouse.up();
    const afterDrag = await moved((i0 + 2) % 15, true);

    // synthetic touch swipe to the right → previous card
    await stage.evaluate((el) => {
      const r = el.getBoundingClientRect();
      const y = r.top + r.height / 2, x0 = r.left + r.width / 2;
      const front = el.querySelector('.ccard[data-front]') as HTMLElement;
      const px = front.offsetWidth * 0.6 * 0.9 / 10;
      const ev = (type: string, x: number) => el.dispatchEvent(new PointerEvent(type, { bubbles: true, pointerId: 7, pointerType: 'touch', isPrimary: true, clientX: x, clientY: y, button: 0 }));
      ev('pointerdown', x0);
      return new Promise<void>((resolve) => { let i = 0; const step = () => { i++; ev('pointermove', x0 + i * px); if (i < 10) setTimeout(step, 16); else { ev('pointerup', x0 + i * px); resolve(); } }; setTimeout(step, 16); });
    });
    const afterSwipe = await moved(afterDrag, false);

    // trackpad-style horizontal wheel → forward
    await stage.evaluate((el) => {
      const front = el.querySelector('.ccard[data-front]') as HTMLElement;
      const dx = front.offsetWidth * 0.6 * 0.9 / 10;
      return new Promise<void>((resolve) => { let i = 0; const tick = () => { el.dispatchEvent(new WheelEvent('wheel', { deltaX: dx, deltaY: 0, bubbles: true, cancelable: true })); if (++i < 10) setTimeout(tick, 16); else resolve(); }; tick(); });
    });
    await moved(afterSwipe, true);

    // hovering a side card pops it up (pointer devices only; phones have no hover)
    if (!isMobile) {
      await page.waitForTimeout(3200); // let the momentum decay and the nearest card settle under the hold
      const side = region.locator('.ccard').nth(((await current()) + 1) % 15); // the neighbour of whatever is in front now
      await expect.poll(() => side.evaluate((el) => el.style.visibility), { timeout: 6000 }).toBe('visible');
      const sb = (await side.boundingBox())!;
      await page.mouse.move(Math.min(sb.x + sb.width / 2, page.viewportSize()!.width - 8), sb.y + sb.height / 2);
      await expect.poll(() => side.locator('.ccard__body').evaluate((el) => getComputedStyle(el).transform), { timeout: 3000 }).not.toBe('none');
    }
  });

  test('text reveals replay when scrolling back up and down again', async ({ page }) => {
    await page.goto('/');
    const title = page.locator('#services .section-title__text').first();
    const tf = () => title.evaluate((el) => getComputedStyle(el).transform);
    const show = () => page.evaluate(() => document.querySelector('#services h2')!.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await show();
    await expect.poll(tf, { timeout: 4000 }).toBe('none');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expect.poll(tf, { timeout: 3000 }).not.toBe('none');
    await show();
    await expect.poll(tf, { timeout: 4000 }).toBe('none');
  });

  test('service icons render at the bolder size', async ({ page }) => {
    await page.goto('/');
    await page.locator('#services').scrollIntoViewIfNeeded();
    const widths = await page.locator('#services li img, #services li svg').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().width));
    expect(widths.length).toBe(10);
    for (const w of widths) expect(w).toBeGreaterThanOrEqual(76);
  });

  test('reduced motion: front card is flat and the typewriter cursor does not animate', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const region = page.locator('.ccar');
    await region.scrollIntoViewIfNeeded();
    await expect.poll(() => region.locator('.ccard[data-front]').evaluate((el) => getComputedStyle(el).transform)).toBe('none');
    expect(await page.locator('.tw__cursor').evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
  });

  test('without JavaScript the testimonials are a scrollable row of readable cards', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto('/');
    const stage = page.locator('.ccar__stage');
    expect(await stage.evaluate((el) => getComputedStyle(el).overflowX)).toBe('auto');
    const visible = await page.locator('.ccard').evaluateAll((els) => els.filter((e) => getComputedStyle(e).visibility === 'visible').length);
    expect(visible).toBe(15);
    await ctx.close();
  });
});
