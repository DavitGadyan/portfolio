import { HomePage } from '@/components/pages/HomePage';
import { homeMetadata } from '@/lib/seo/home-metadata';
export const metadata = homeMetadata('en');
export default function Page() { return <HomePage locale="en" />; }
