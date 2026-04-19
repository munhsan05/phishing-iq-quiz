CREATE TYPE "public"."question_type" AS ENUM('email', 'sms', 'qr', 'browser', 'inbox_item');--> statement-breakpoint
CREATE TYPE "public"."quiz_mode" AS ENUM('leveled', 'mixed', 'category');--> statement-breakpoint
CREATE TABLE "inbox_batches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"age_group" "age_group" NOT NULL,
	"context" text,
	"time_limit_sec" smallint DEFAULT 90 NOT NULL,
	"order_index" smallint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "answers" ALTER COLUMN "question_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "answers" ADD COLUMN "batch_id" uuid;--> statement-breakpoint
ALTER TABLE "answers" ADD COLUMN "inbox_selections" jsonb;--> statement-breakpoint
ALTER TABLE "answers" ADD COLUMN "score" numeric(4, 3);--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "type" "question_type" DEFAULT 'email' NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "content" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "batch_id" uuid;--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_batch_id_inbox_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."inbox_batches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_batch_id_inbox_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."inbox_batches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "answers_batch_idx" ON "answers" USING btree ("batch_id");--> statement-breakpoint
CREATE INDEX "questions_batch_idx" ON "questions" USING btree ("batch_id");