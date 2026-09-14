import type { APIRoute } from 'astro';

export const prerender = false;

// 배포·가드 체인 동작 확인용. DB 확인은 Hyperdrive 연결 후 추가한다 (M0 3단계).
export const GET: APIRoute = () =>
  new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
