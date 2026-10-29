import { BlogIndexPage, blogMetadata } from '@/components/pages/BlogIndexPage';
export const metadata = blogMetadata('en');
export default function Page() { return <BlogIndexPage locale="en" />; }
