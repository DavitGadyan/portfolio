import { expect, test } from '@playwright/test';

test.describe('lead surfaces', () => {
  test('contact form posts to Formspree via fetch and shows the success state once', async ({ page }) => {
    let posts = 0;
    await page.route('**/formspree.io/**', async (route) => { posts++; await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }); });
    await page.goto('/');
    await page.getByTestId('cookie-banner').getByRole('button', { name: /essential/i }).click();
    const form = page.getByTestId('contact-form');
    await form.getByLabel(/name/i).fill('Test Person');
    await form.getByLabel(/email/i).fill('test@example.com');
    await form.getByLabel(/message/i).fill('Hello, this is a test message.');
    await form.getByRole('button', { name: /send message/i }).click();
    await expect(page.getByTestId('contact-success')).toBeVisible();
    expect(posts).toBe(1);
  });

  test('native validation blocks an invalid email', async ({ page }) => {
    await page.goto('/');
    const form = page.getByTestId('contact-form');
    await form.getByLabel(/name/i).fill('Test');
    await form.getByLabel(/email/i).fill('not-an-email');
    await form.getByLabel(/message/i).fill('Hello there, testing.');
    await form.getByRole('button', { name: /send message/i }).click();
    const invalid = await form.getByLabel(/email/i).evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(invalid).toBe(true);
    await expect(page.getByTestId('contact-success')).toHaveCount(0);
  });

  test('Calendly loads nothing until the booking button is pressed', async ({ page }) => {
    const calendly: string[] = [];
    page.on('request', (r) => { if (/calendly\.com/.test(r.url())) calendly.push(r.url()); });
    await page.goto('/');
    await page.locator('#book').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    expect(calendly).toHaveLength(0);
    await page.getByTestId('book-placeholder').getByRole('button').click();
    await page.waitForTimeout(1500);
    expect(calendly.length).toBeGreaterThan(0);
  });

  test('video facade injects the provider iframe only after a click', async ({ page }) => {
    await page.goto('/portfolio/ai-marketing-ga4-seo-geo/');
    const facade = page.locator('.facade').first();
    await expect(facade.locator('iframe')).toHaveCount(0);
    await facade.getByRole('button').click();
    await expect(facade.locator('iframe')).toHaveAttribute('src', /youtube-nocookie\.com|loom\.com\/embed/);
  });
});
