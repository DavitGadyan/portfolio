import fs from 'node:fs';
import path from 'node:path';
import { Img } from '@/components/ui/Img';
import { withBasePath } from '@/lib/site';

const dims = new Map<string, { width: number; height: number } | null>();

async function probe(src: string) {
  if (dims.has(src)) return dims.get(src) ?? null;
  let out: { width: number; height: number } | null = null;
  try {
    const file = path.join(process.cwd(), 'public', src);
    if (fs.existsSync(file)) {
      const sharp = (await import('sharp')).default;
      const m = await sharp(file).metadata();
      if (m.width && m.height) out = { width: m.width, height: m.height };
    }
  } catch { /* fall through */ }
  dims.set(src, out);
  return out;
}

/** Inline markdown image. Local /images/* paths go through the optimizer with probed dimensions; others render as plain lazy images. */
export async function MdImage({ src, alt }: { src: string; alt: string }) {
  if (src.startsWith('/images/')) {
    const d = await probe(src);
    if (d) return <Img src={src} alt={alt} width={d.width} height={d.height} sizes="(min-width: 1024px) 720px, 92vw" className="h-auto w-full" loading="lazy" />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src.startsWith('/') ? withBasePath(src) : src} alt={alt} loading="lazy" decoding="async" />;
}
