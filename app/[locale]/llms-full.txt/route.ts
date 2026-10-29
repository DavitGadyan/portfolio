import { buildLlms } from '@/lib/seo/llms';
import { isLocale, secondaryLocales } from '@/lib/i18n/config';
export const dynamic = 'force-static';
export function generateStaticParams() { return secondaryLocales.map((locale) => ({ locale })); }
export async function GET(_req: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return new Response(buildLlms(isLocale(locale) ? locale : 'en', true), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
