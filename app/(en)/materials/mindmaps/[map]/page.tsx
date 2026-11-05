import { MindMapPage, mindMapMetadata, mapIds } from '@/components/pages/MindMapsPage';
type P = { params: Promise<{ map: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return mapIds.map((map) => ({ map })); }
export async function generateMetadata({ params }: P) { const { map } = await params; return mindMapMetadata('en', map); }
export default async function Page({ params }: P) { const { map } = await params; return <MindMapPage locale="en" id={map} />; }
