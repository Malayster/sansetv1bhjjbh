import { config } from '../config.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { escapeMarkup } from '../utils/escape.js';

export class SeoController {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  getSitemap = asyncHandler(async (req, res, next) => {
    const baseUrl = config.clientUrl || 'https://dinoempire.my';
    const today = new Date().toISOString().split('T')[0];

    const products = await this.productRepository.findAll({
      where: { aktif: true },
      select: { slug: true, guncellenmeTarihi: true }
    });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <url>
    <loc>${baseUrl}/kedai</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/hubungi</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/soalan-lazim</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/tentang</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/penghantaran</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/pulangan</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/privasi</loc>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
`;

    for (const product of products) {
      if (!product.slug) continue;
      const lastmod = product.guncellenmeTarihi
        ? new Date(product.guncellenmeTarihi).toISOString().split('T')[0]
        : today;
      xml += `  <url>
    <loc>${escapeMarkup(`${baseUrl}/produk/${encodeURIComponent(product.slug)}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;
    }

    xml += `</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(xml);
  });
}
