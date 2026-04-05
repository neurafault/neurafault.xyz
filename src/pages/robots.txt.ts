import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const body = `User-agent: *
Allow: /

Sitemap: https://neurafault.xyz/sitemap-index.xml
`;

  return new Response(body.trim(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
