import { writeFileSync } from 'fs';
import prettier from 'prettier';

async function generate() {
  const prettierConfig = await prettier.resolveConfig('./prettierrc.json');

  const robots =
    `Sitemap: /sitemap.xml\n\n` +
    `User-agent: *\nDisallow: /admin\n\n` +
    `User-agent: *\nDisallow: /user\n\n` +
    `User-agent: *\nDisallow: /api\n\n` +
    `User-agent: *\nAllow: /about\n\n` +
    `User-agent: *\nAllow: /`;

  const formatted = prettier.format(robots, {
    ...prettierConfig,
    parser(text) {
      return text;
    }
  });

  // eslint-disable-next-line no-sync
  writeFileSync('public/robots.txt', formatted);
}

generate();
