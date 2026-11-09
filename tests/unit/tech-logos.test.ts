import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { logos, logoSrc, type LogoId } from '@/data/skillLogos';
import { LIGHT_MARKS, techLogo } from '@/lib/content/techLogos';

/** "Stack by layer" chips on the project pages: the right mark for each entry, and never an empty disc. */
const DIR = join(process.cwd(), 'content/en/projects');
const chips = readdirSync(DIR).filter((f) => f.endsWith('.mdx')).flatMap((f) => {
  const stack = (matter(readFileSync(join(DIR, f), 'utf8')).data.stack ?? {}) as Record<string, unknown[]>;
  return Object.values(stack).flat().map((s) => String(s));
});

/** Share of the disc that carries ink once the mark sits on white, the way a chip shows it (`darkened` = the CSS brightness(0)). */
async function ink(src: string, darkened: boolean): Promise<number> {
  const { data, info } = await sharp(join(process.cwd(), 'public', src), { density: 300 })
    .resize(44, 44, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let n = 0;
  for (let i = 0; i < data.length; i += 4) {
    const darkest = darkened ? 0 : Math.min(data[i], data[i + 1], data[i + 2]);
    if ((255 - darkest) * (data[i + 3] / 255) > 40) n++;
  }
  return n / (info.width * info.height);
}

describe('project stack chips', () => {
  it('the text before the first bracket or semicolon names the mark', () => {
    expect(techLogo('Next.js 15, React 19, TypeScript')?.label).toBe('Next.js');
    expect(techLogo('Docker Compose (Postgres, Redis, MLflow, API, web), Makefile')?.label).toBe('Docker');
    expect(techLogo('OpenAI SDK for ChatGPT and OpenAI-compatible private models (Ollama, vLLM)')?.label).toBe('OpenAI');
    expect(techLogo('Claude via the Anthropic SDK (opus-5-5, haiku-5-5); Claude in Microsoft Foundry for prod')?.label).toBe('Claude');
    expect(techLogo('Python 3.12, FastAPI, SQLAlchemy (async), Alembic')?.label).toBe('FastAPI');
    expect(techLogo('TensorRT (NVIDIA Jetson)')?.label).toBe('NVIDIA');
    expect(techLogo('Vector store (pgvector on Postgres)')?.label).toBe('PostgreSQL'); // nothing known in the lead: the whole text decides
  });

  it('a word that only contains a product name gets no mark, and the specific product beats its family', () => {
    expect(techLogo('LightGBM LambdaRank ranker with 23 features')).toBeNull(); // not AWS Lambda
    expect(techLogo('AWS Lambda')?.label).toBe('AWS');
    expect(techLogo('AWS Textract')?.label).toBe('AWS Textract');
    expect(techLogo('React Native (Expo, New Architecture)')?.label).toBe('React Native');
    expect(techLogo('React 19')?.label).toBe('React');
    expect(techLogo('Plotly Dash')?.label).toBe('Plotly Dash');
    expect(techLogo('Marketing dashboard')).toBeNull();
    expect(techLogo('MLflow model registry')?.label).toBe('MLflow');
    expect(techLogo('PySpark and Delta Lake')?.label).toBe('Apache Spark');
    expect(techLogo('Streamlit Cloud')?.label).toBe('Streamlit');
    expect(techLogo('D3.js force-directed graph')?.label).toBe('D3.js');
  });

  it('white marks are flagged so the chip darkens them', () => {
    expect(techLogo('GitHub Actions CI')).toMatchObject({ label: 'GitHub', mono: true });
    expect(techLogo('MySQL 8')?.mono).toBe(true);
    expect(techLogo('Next.js 15')?.mono).toBe(false);
  });

  it('every logo file exists, and a mark that vanishes on white is declared a light mark', async () => {
    for (const id of Object.keys(logos) as LogoId[]) {
      expect(existsSync(join(process.cwd(), 'public', logoSrc(id))), logoSrc(id)).toBe(true);
      if ((await ink(logoSrc(id), false)) < 0.03) expect(LIGHT_MARKS.has(id), `${id} is invisible on a white disc: add it to LIGHT_MARKS`).toBe(true);
    }
  });

  it('every chip of every project shows a visible mark or a monogram, never an empty disc', async () => {
    const used = new Map<string, boolean>();
    for (const text of chips) { const logo = techLogo(text); if (logo) used.set(logo.src, logo.mono); }
    expect(chips.length).toBeGreaterThan(400);
    expect(used.size).toBeGreaterThan(40);
    for (const [src, mono] of used) expect(await ink(src, mono), src).toBeGreaterThan(0.03);
  });
});
