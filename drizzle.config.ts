import { defineConfig } from 'drizzle-kit';

// 스키마 변경은 `npm run db:generate`로 SQL 파일을 만들어 커밋한 뒤 `npm run db:migrate`로 적용한다.
// `drizzle-kit push` 금지 (결정 #21).
try {
  process.loadEnvFile('.env');
} catch {
  // .env가 없으면 셸 환경 변수를 쓴다 (CI)
}
const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL이 없다. .env.example을 복사해 .env를 만든다');

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dbCredentials: { url },
  strict: true,
});
