import type { Metadata } from 'next';
import { NotFoundPage } from '@/components/pages/NotFoundPage';
export const metadata: Metadata = { title: 'Page not found', robots: { index: false, follow: false } };
export default function Page() { return <NotFoundPage />; }
