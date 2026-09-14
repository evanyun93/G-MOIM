// IP 단위 폭주 차단 (결정 #23). Rate Limiting 바인딩은 위치별로 따로 세어 부정확하다.
// 유저 쿼터 집계에는 쓰지 않는다 — 그건 services/quota + DB.
import { env } from 'cloudflare:workers';

export async function allowByKey(key: string): Promise<boolean> {
  const { success } = await env.RL_API.limit({ key });
  return success;
}
