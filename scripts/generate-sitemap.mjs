import { writeFileSync } from 'fs';
import { globby } from 'globby';
import prettier from 'prettier';

import dotenv from 'dotenv';
dotenv.config();

async function generate() {
  const prettierConfig = await prettier.resolveConfig('./prettierrc.json');
  const pages = await globby([
    './src/pages/index.tsx',
    './src/pages/about',
    './src/pages/app',
    '!./src/pages/_*.tsx',
    '!./src/pages/api',
    '!./src/pages/admin',
    '!./src/pages/404.tsx',
    '!./src/pages/user'
  ]);

  let FQDN = process.env.NEXT_PUBLIC_FQDN;
  if (process.env.NODE_ENV == 'development') {
    FQDN = 'localhost.localdomain';
  }

  const time = Date.now();
  const now = new Date(time).toISOString();

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${pages
          .map((page) => {
            const path = page
              .replace('./src', '')
              .replace('/src', '')
              .replace('src', '')
              .replace('/pages', '')
              .replace('/data', '')
              .replace('/index.tsx', '')
              .replace('.tsx', '')
              .replace('.js', '');
            const route = path === '/index' ? '' : path;

            let changefreq = 'yearly';
            if (route.indexOf('/news') != -1) {
              changefreq = 'monthly';
            } else if (route.indexOf('/app') != -1) {
              changefreq = 'daily';
            } else if (route.indexOf('/about') != -1) {
              changefreq = 'monthly';
            } else if (route.indexOf('/explore') != -1) {
              changefreq = 'monthly';
            }

            let priority = 0.2;
            if (route === '/news') {
              priority = 0.4;
            } else if (route.indexOf('/explore') != -1) {
              priority = 0.7;
            } else if (route.indexOf('/about') != -1) {
              priority = 0.6;
            } else if (route === '') {
              priority = 0.8;
            }

            return `
              <url>
                  <loc>${`https://${FQDN}${route}`}</loc>
                  <lastmod>${now}</lastmod>
                  <changefreq>${changefreq}</changefreq>
                  <priority>${priority}</priority>
              </url>`;
          })
          .join('')}
    </urlset>
    `;

  const formatted = prettier.format(sitemap, {
    ...prettierConfig,
    parser: 'html'
  });

  // eslint-disable-next-line no-sync
  writeFileSync('public/sitemap.xml', formatted);
}

generate();
