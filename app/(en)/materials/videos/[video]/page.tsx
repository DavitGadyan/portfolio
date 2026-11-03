import { VideoPage, videoMetadata, videoIds } from '@/components/pages/VideosPage';
type P = { params: Promise<{ video: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return videoIds.map((video) => ({ video })); }
export async function generateMetadata({ params }: P) { const { video } = await params; return videoMetadata('en', video); }
export default async function Page({ params }: P) { const { video } = await params; return <VideoPage locale="en" id={video} />; }
