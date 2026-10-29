// Generate public/share-card.jpg (EN) and public/share-card-es.jpg (ES): 1200x630 OG images with the current positioning.
import sharp from 'sharp';

const W = 1200, H = 630;
const COPY = {
  en: { file: 'public/share-card.jpg', title: 'Full-Stack AI Engineer  ·  Barcelona', line1: 'AI integration  ·  AI ERP & SaaS  ·  Databases', line2: 'DevOps & LLMOps  ·  Security  ·  AI marketing', stats: '190+ projects  ·  50+ long-term clients  ·  8+ years', url: 'davidgadyan.com' },
  es: { file: 'public/share-card-es.jpg', title: 'Ingeniero Full-Stack de IA  ·  Barcelona', line1: 'Integración de IA  ·  ERP y SaaS con IA  ·  Bases de datos', line2: 'DevOps y LLMOps  ·  Seguridad  ·  Marketing con IA', stats: 'Más de 190 proyectos  ·  Más de 50 clientes  ·  Más de 8 años', url: 'davidgadyan.com/es' },
};
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const FONT = "'Rubik','Helvetica Neue',Helvetica,Arial,sans-serif";

const portrait = await sharp('assets/images/backgrounds/portrait-about.jpg').resize({ height: H }).grayscale().toBuffer();
const pw = (await sharp(portrait).metadata()).width;
const px = W - pw + 40; // slight bleed to the right edge
const fade = Buffer.from(`<svg width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#2b2c2f" stop-opacity="1"/><stop offset="0.55" stop-color="#2b2c2f" stop-opacity="1"/><stop offset="0.78" stop-color="#2b2c2f" stop-opacity="0.35"/><stop offset="1" stop-color="#2b2c2f" stop-opacity="0.15"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/></svg>`);

for (const [locale, c] of Object.entries(COPY)) {
  const text = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <text x="72" y="190" font-family="${FONT}" font-size="76" font-weight="700" fill="#ffffff">David Gadyan</text>
    <text x="72" y="248" font-family="${FONT}" font-size="30" font-weight="500" fill="#e5e7eb" letter-spacing="2">${esc(c.title.toUpperCase())}</text>
    <rect x="72" y="292" width="80" height="5" fill="#9ca3af"/>
    <text x="72" y="352" font-family="${FONT}" font-size="26" fill="#d1d5db">${esc(c.line1)}</text>
    <text x="72" y="392" font-family="${FONT}" font-size="26" fill="#d1d5db">${esc(c.line2)}</text>
    <text x="72" y="470" font-family="${FONT}" font-size="24" fill="#9ca3af">${esc(c.stats)}</text>
    <text x="72" y="560" font-family="${FONT}" font-size="22" font-weight="500" fill="#ffffff" letter-spacing="3">${esc(c.url.toUpperCase())}</text>
  </svg>`);
  await sharp({ create: { width: W, height: H, channels: 3, background: '#2b2c2f' } })
    .composite([{ input: portrait, left: px, top: 0 }, { input: fade, left: 0, top: 0 }, { input: text, left: 0, top: 0 }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(c.file);
  console.log(`${locale}: ${c.file}`);
}
