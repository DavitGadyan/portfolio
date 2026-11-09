import { expect, test } from '@playwright/test';

test.describe('project showcase', () => {
  test('portfolio index lists the six showcase projects first, in the hand-set order (two rows of three on desktop)', async ({ page }) => {
    await page.goto('/portfolio/');
    const titles = page.getByTestId('project-card').locator('h2');
    const order = [/Virgil\.ai/, /Real Estate/, /ImprovTalk/, /YOLO26\/27/, /Crypto Trading Bots/, /AI Trading Assistant/];
    for (const [i, re] of order.entries()) await expect(titles.nth(i)).toHaveText(re);
    for (const [i, re] of [/Azure AI Automation/, /HubAIOps/, /Salesforce/, /Receptra/, /Snowflake/, /Lakehouse AI Studio/, /SmartSearch/, /CareLens/, /AI Marketing/].entries()) await expect(titles.nth(6 + i)).toHaveText(re); // the second tier: Azure, HubAIOps, Salesforce on one desktop row, then Receptra, Snowflake, Lakehouse AI Studio, then SmartSearch, CareLens, AI Marketing
  });

  test('the YOLO26 page embeds three self-hosted demos that load no video bytes until played', async ({ page }) => {
    const media: string[] = [];
    page.on('request', (r) => { if (r.url().endsWith('.mp4')) media.push(r.url()); });
    await page.goto('/portfolio/computer-vision-yolo26-demos/');
    const videos = page.locator('.prose-dg video');
    await expect(videos).toHaveCount(3);
    for (const v of await videos.all()) {
      await expect(v).toHaveAttribute('preload', 'none');
      await expect(v).toHaveAttribute('poster', /\/videos\/yolo-[a-z-]+\.jpg$/);
      await expect(v.locator('source')).toHaveAttribute('src', /\/videos\/yolo-[a-z-]+\.mp4$/);
    }
    await page.waitForTimeout(500);
    expect(media).toHaveLength(0);
    await page.goto('/es/portfolio/computer-vision-yolo26-demos/');
    await expect(page.locator('.prose-dg video')).toHaveCount(3);
  });

  test('the Receptra, real-estate and ImprovTalk pages render their new content', async ({ page }) => {
    await page.goto('/portfolio/ai-voice-receptionist-saas/');
    await expect(page.locator('h1')).toHaveText(/Receptra/);
    await page.goto('/portfolio/ai-real-estate-development-platform/');
    await expect(page.locator('.prose-dg img')).toHaveCount(5);
    await expect(page.locator('h1')).toHaveText(/Lot Analysis/);
    await page.goto('/portfolio/ai-video-ads-improvtalk/');
    await expect(page.locator('h1')).toHaveText(/React Native AI Coach/);
    await expect(page.locator('.prose-dg img:not(.facade img)')).toHaveCount(3); // design-system screenshots (the facades carry their own thumbnails)
    await expect(page.locator('.prose-dg .facade__btn')).toHaveCount(2); // the two ad videos, still click-to-load
    const phones = page.locator('.prose-dg .screen video');
    await expect(phones).toHaveCount(4); // app screen recordings: poster only until played
    for (const v of await phones.all()) {
      await expect(v).toHaveAttribute('preload', 'none');
      await expect(v).toHaveAttribute('poster', /\/videos\/improvtalk-[a-z-]+\.webp$/);
    }
    await expect(page.locator('.prose-dg .screen h3')).toHaveCount(4); // one explained screen per clip
    await expect(page.locator('a[href="https://improvtalk.vip"]')).toBeVisible();
    await page.goto('/es/portfolio/ai-video-ads-improvtalk/');
    await expect(page.locator('h1')).toHaveText(/coach de IA en React Native/);
    await page.goto('/portfolio/ai-trading-assistant-strategy-copilot/');
    await expect(page.locator('.prose-dg video')).toHaveCount(5); // sanitised demo clips, poster-only until played
    for (const v of await page.locator('.prose-dg video').all()) await expect(v).toHaveAttribute('preload', 'none');
    await expect(page.locator('.prose-dg img:not(.facade img)')).toHaveCount(4);
  });

  test('stack chips: every icon loads, the first technology named picks the mark, and the white GitHub mark is darkened on its white disc', async ({ page }) => {
    await page.goto('/portfolio/smartsearch-ecommerce-search-ranking/');
    const chip = (text: string) => page.locator('.tchip', { hasText: text }).locator('img');
    await expect(chip('Next.js 15')).toHaveAttribute('src', /\/logos\/nextjs\.png$/);
    await expect(chip('Docker Compose')).toHaveAttribute('src', /\/logos\/docker\.png$/); // not the Postgres named inside its brackets
    await expect(chip('MLflow model registry')).toHaveAttribute('src', /\/logos\/mlflow\.svg$/);
    await expect(page.locator('.tchip', { hasText: 'LambdaRank' }).locator('img')).toHaveCount(0); // a monogram, not the AWS mark
    for (const img of await page.locator('.tchip img').all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((i: HTMLImageElement) => i.naturalWidth)).toBeGreaterThan(0);
    }
    await expect(chip('GitHub Actions')).toHaveAttribute('data-mono', '');
    expect(await chip('GitHub Actions').evaluate((i) => getComputedStyle(i).filter)).toBe('brightness(0)');
    await expect(chip('Next.js 15')).not.toHaveAttribute('data-mono', '');
  });
});
