import { describe, expect, it } from 'vitest';
import { getLocaleFromPath, homePath, localizePath, pagePath, sectionHref, stripLocale } from '@/lib/locale-path';

describe('locale-path', () => {
  it('detects locale', () => {
    expect(getLocaleFromPath('/')).toBe('en');
    expect(getLocaleFromPath('/es')).toBe('es');
    expect(getLocaleFromPath('/es/')).toBe('es');
    expect(getLocaleFromPath('/es/portfolio/x/')).toBe('es');
    expect(getLocaleFromPath('/estonia/')).toBe('en');
  });
  it('strips locale and normalises trailing slash', () => {
    expect(stripLocale('/es/portfolio/x')).toBe('/portfolio/x/');
    expect(stripLocale('/es')).toBe('/');
    expect(stripLocale('/blog/y')).toBe('/blog/y/');
    expect(stripLocale('/es/blog/y/#top')).toBe('/blog/y/#top');
  });
  it('maps paths between locales', () => {
    expect(localizePath('/', 'es')).toBe('/es/');
    expect(localizePath('/es/', 'en')).toBe('/');
    expect(localizePath('/portfolio/x/', 'es')).toBe('/es/portfolio/x/');
    expect(localizePath('/es/portfolio/x/', 'en')).toBe('/portfolio/x/');
    expect(localizePath('/es/blog/y', 'en', '#top')).toBe('/blog/y/#top');
    expect(localizePath('/portfolio/x/#details', 'es')).toBe('/es/portfolio/x/#details');
  });
  it('builds home, page and section hrefs', () => {
    expect(homePath('en')).toBe('/');
    expect(homePath('es')).toBe('/es/');
    expect(pagePath('es', '/blog/')).toBe('/es/blog/');
    expect(sectionHref('en', 'about')).toBe('/#about');
    expect(sectionHref('es', 'about')).toBe('/es/#about');
  });
});
