import { defineMiddleware } from 'astro:middleware';
import { readSwitches } from './platform/env';
import { allowByKey } from './platform/rate-limit';
import { blockedBySwitch } from './services/switches';

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

// API 가드 체인. 싼 검사를 앞에 둔다 (아키텍처 2장).
// 스위치 → IP 제한 → 인증(M2) → 유저 쿼터(M3) → 입력 검증(각 라우트)
export const onRequest = defineMiddleware(async (context, next) => {
  if (context.isPrerendered) return next();

  const { request, url } = context;

  if (url.pathname.startsWith('/api/')) {
    const blocked = blockedBySwitch(request.method, url.pathname, readSwitches());
    if (blocked) return json({ error: blocked.reason }, blocked.status);

    const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
    if (!(await allowByKey(`ip:${ip}`))) return json({ error: 'rate_limited' }, 429);
  }

  const response = await next();
  // 공개 전까지 전체 noindex (결정 #12). 정적 페이지는 public/_headers가 같은 헤더를 붙인다.
  const headers = new Headers(response.headers);
  headers.set('X-Robots-Tag', 'noindex');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
});
