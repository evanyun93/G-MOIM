CREATE TABLE "daily_metrics" (
	"day" date PRIMARY KEY NOT NULL,
	"worker_requests" integer,
	"rate_limited" integer,
	"uploads" integer,
	"upload_bytes" bigint,
	"heic_rejected" integer,
	"uploads_mobile" integer,
	"uploads_desktop" integer,
	"signups" integer,
	"posts_published" integer,
	"active_authors" integer,
	"comments" integer,
	"pageviews_kit" integer,
	"pageviews_unit" integer,
	"pageviews_post" integer,
	"visits_estimated" integer,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
