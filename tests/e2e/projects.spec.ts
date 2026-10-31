import { expect, test } from '@playwright/test';

test.describe('project showcase', () => {
  test('portfolio index lists the featured projects first: Virgil, the real-estate platform, ImprovTalk', async ({ page }) => {
    await page.goto('/portfolio/');
    const titles = page.getByTestId('project-card').locator('h2');
    await expect(titles.nth(0)).toHaveText(/Virgil\.ai/);
    await expect(titles.nth(1)).toHaveText(/Real Estate/);
    await expect(titles.nth(2)).toHaveText(/ImprovTalk/);
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

  test('the Receptra and real-estate pages render their new content', async ({ page }) => {
    await page.goto('/portfolio/ai-voice-receptionist-saas/');
    await expect(page.locator('h1')).toHaveText(/Receptra/);
    await page.goto('/portfolio/ai-real-estate-development-platform/');
    await expect(page.locator('.prose-dg img')).toHaveCount(5);
    await expect(page.locator('h1')).toHaveText(/Lot Analysis/);
  });
});
