import { MaterialPage, materialMetadata, materialIds } from '@/components/pages/MaterialsPage';
type P = { params: Promise<{ tool: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return materialIds.map((tool) => ({ tool })); }
export async function generateMetadata({ params }: P) { const { tool } = await params; return materialMetadata('en', tool); }
export default async function Page({ params }: P) { const { tool } = await params; return <MaterialPage locale="en" id={tool} />; }
