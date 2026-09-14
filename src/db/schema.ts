import { bigint, date, integer, pgTable, timestamp } from 'drizzle-orm/pg-core';

// 일별 집계 (결정 #14). 소급 집계가 안 되므로 기능보다 먼저 만든다.
// null = 아직 수집하지 않음, 0 = 수집했고 0건. 둘을 섞지 않는다.
export const dailyMetrics = pgTable('daily_metrics', {
  day: date('day').primaryKey(),

  // 자체 집계
  workerRequests: integer('worker_requests'),
  rateLimited: integer('rate_limited'), // 429 발생 수 (#20)
  uploads: integer('uploads'),
  uploadBytes: bigint('upload_bytes', { mode: 'number' }),
  heicRejected: integer('heic_rejected'), // (#32)
  uploadsMobile: integer('uploads_mobile'), // 업로드 기기 구분 (#35)
  uploadsDesktop: integer('uploads_desktop'),
  signups: integer('signups'),
  postsPublished: integer('posts_published'), // (#37)
  activeAuthors: integer('active_authors'),
  comments: integer('comments'), // (#38)

  // 외부 스냅샷 — Web Analytics 표본 추정치. 판정·쿼터에 쓰지 않는다 (#39)
  pageviewsKit: integer('pageviews_kit'),
  pageviewsUnit: integer('pageviews_unit'),
  pageviewsPost: integer('pageviews_post'),
  visitsEstimated: integer('visits_estimated'),

  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
