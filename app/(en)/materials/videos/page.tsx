import { VideosPage, videosMetadata } from '@/components/pages/VideosPage';
export const metadata = videosMetadata('en');
export default function Page() { return <VideosPage locale="en" />; }
