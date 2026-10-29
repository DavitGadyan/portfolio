import { buildLlms } from '@/lib/seo/llms';
export const dynamic = 'force-static';
export function GET() { return new Response(buildLlms('en', false), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }); }
