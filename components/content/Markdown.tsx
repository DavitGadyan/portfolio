import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import type { AnchorHTMLAttributes, ImgHTMLAttributes, ReactNode } from 'react';
import { VideoFacade } from '@/components/embeds/VideoFacade';
import { Video } from '@/components/embeds/Video';
import { Screen } from '@/components/embeds/Screen';
import { MdImage } from './MdImage';
import { withBasePath } from '@/lib/site';

function MdLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const href = props.href ?? '';
  const external = /^https?:\/\//i.test(href);
  const internal = href.startsWith('/') ? withBasePath(href) : href; // site-relative links in MDX must respect the deploy basePath
  return <a {...props} href={internal} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} />;
}

export function Markdown({ source, playLabel = 'Play video' }: { source: string; playLabel?: string }) {
  const components = {
    YouTube: (p: { id: string; title?: string }) => <VideoFacade provider="youtube" {...p} playLabel={playLabel} />,
    Loom: (p: { id: string; title?: string }) => <VideoFacade provider="loom" {...p} playLabel={playLabel} />,
    Video: (p: { src: string; poster?: string; title?: string; ratio?: string; caption?: string }) => <Video {...p} />,
    Screen: (p: { src: string; poster?: string; title: string; ratio?: string; children?: ReactNode }) => <Screen {...p} />,
    img: (p: ImgHTMLAttributes<HTMLImageElement>) => <MdImage src={String(p.src ?? '')} alt={String(p.alt ?? '')} />,
    a: MdLink,
  };
  return (
    <MDXRemote source={source} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }} />
  );
}
