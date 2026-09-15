// DB 연결은 이 파일에서만 만든다 (결정 #19 #22). 표준 Postgres 드라이버(pg) + Hyperdrive.
// 연결은 요청마다 새로 만들고 끝나면 닫는다 — 요청 사이에 연결 객체를 공유하지 않는다.
import { env } from 'cloudflare:workers';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from '../db/schema';

export type Db = NodePgDatabase<typeof schema>;

export async function withDb<T>(fn: (db: Db) => Promise<T>): Promise<T> {
  const client = new Client({ connectionString: env.HYPERDRIVE.connectionString });
  await client.connect();
  try {
    return await fn(drizzle(client, { schema }));
  } finally {
    await client.end();
  }
}
