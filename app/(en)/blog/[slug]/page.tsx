import { PostPage, postMetadata } from '@/components/pages/PostPage';
import { getPostSlugs } from '@/lib/content/posts';
export const dynamicParams = false;
export function generateStaticParams() { return getPostSlugs().map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return postMetadata('en', slug); }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <PostPage locale="en" slug={slug} />; }
