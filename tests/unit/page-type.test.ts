import { describe, expect, it } from 'vitest';
import { pageType } from '@/lib/page-type';

describe('pageType', () => {
  it('groups site paths, with or without the Spanish prefix', () => {
    expect(pageType('/')).toBe('home');
    expect(pageType('/es')).toBe('home');
    expect(pageType('/es/')).toBe('home');
    expect(pageType('/portfolio/')).toBe('portfolio');
    expect(pageType('/es/portfolio')).toBe('portfolio');
    expect(pageType('/portfolio/virgil-ai-health-insurance-agent/')).toBe('project');
    expect(pageType('/es/portfolio/virgil-ai-health-insurance-agent/')).toBe('project');
    expect(pageType('/blog/')).toBe('blog');
    expect(pageType('/blog/improvtalk-charisma-app/')).toBe('post');
    expect(pageType('/es/blog/improvtalk-charisma-app')).toBe('post');
    expect(pageType('/cookies/')).toBe('page');
    expect(pageType('/es/privacy/')).toBe('page');
  });
});
