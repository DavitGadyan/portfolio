'use client';
import dynamic from 'next/dynamic';
import type { MindMapView, MindStrings } from './MindMapFlow';

/** React Flow is loaded only on the mind-map pages, after hydration; the no-JS list in the page covers the meantime and the crawlers. */
const MindMapFlow = dynamic(() => import('./MindMapFlow'), { ssr: false, loading: () => <div className="mm" aria-hidden="true"><div className="mm__stage mm__stage--loading" /></div> });

export function MindMapLab(props: { view: MindMapView; t: MindStrings }) {
  return <MindMapFlow {...props} />;
}
