import type { APIRoute } from 'astro';
import { sql } from 'drizzle-orm';
import { withDb } from '../../platform/db';

export const prerender = false;

// 배포·가드 체인·DB 연결 확인용. 미들웨어의 IP 제한을 받는다.
// 오류 내용은 응답에 넣지 않는다(연결 정보 노출 방지). 원인은 Workers 로그에서 본다.
export const GET: APIRoute = async () => {
  let db: 'up' | 'down' = 'down';
  try {
    await withDb((d) => d.execute(sql`select 1`));
    db = 'up';
  } catch (err) {
    console.error(JSON.stringify({ event: 'health_db_failed', message: err instanceof Error ? err.message : String(err) }));
  }
  return new Response(JSON.stringify({ ok: db === 'up', db }), {
    status: db === 'up' ? 200 : 503,
    headers: { 'content-type': 'application/json' },
  });
};
