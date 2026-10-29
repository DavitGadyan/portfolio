import type { ReactNode } from 'react';
import { RootShell } from '@/components/layout/RootShell';
import { rootMetadata, rootViewport } from '@/lib/seo/metadata';

export const metadata = rootMetadata('en');
export const viewport = rootViewport;

export default function Layout({ children }: { children: ReactNode }) {
  return <RootShell locale="en">{children}</RootShell>;
}
