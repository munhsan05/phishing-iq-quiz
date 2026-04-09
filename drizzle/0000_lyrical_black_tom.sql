CREATE TYPE "public"."age_group" AS ENUM('6-18', '18-35', '35-60+');--> statement-breakpoint
CREATE TYPE "public"."question_category" AS ENUM('email_phishing', 'sms_smishing', 'voice_vishing', 'url_spoofing', 'social_eng', 'credential_theft', 'other');--> statement-breakpoint
CREATE TYPE "public"."test_type" AS ENUM('pre', 'post', 'practice');--> statement-breakpoint
CREATE TABLE "answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"test_id" uuid NOT NULL,
	"question_id" integer NOT NULL,
	"selected_is_phish" boolean,
	"is_correct" boolean NOT NULL,
	"time_taken_ms" integer NOT NULL,
	"answered_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"age_group" "age_group" NOT NULL,
	"order_index" smallint NOT NULL,
	"category" "question_category" NOT NULL,
	"email_from" varchar(200) NOT NULL,
	"email_subject" varchar(300) NOT NULL,
	"email_body" text NOT NULL,
	"email_url" varchar(500),
	"is_phish" boolean NOT NULL,
	"explanation" text NOT NULL,
	"recommendation" text NOT NULL,
	"difficulty" smallint DEFAULT 3 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"test_type" "test_type" DEFAULT 'practice' NOT NULL,
	"experiment_id" uuid,
	"age_group" "age_group" NOT NULL,
	"score" smallint DEFAULT 0 NOT NULL,
	"total_questions" smallint NOT NULL,
	"total_time_ms" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"age_group" "age_group" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_test_id_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."tests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tests" ADD CONSTRAINT "tests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "answers_test_idx" ON "answers" USING btree ("test_id");--> statement-breakpoint
CREATE INDEX "answers_question_idx" ON "answers" USING btree ("question_id");--> statement-breakpoint
CREATE UNIQUE INDEX "questions_age_order_unique" ON "questions" USING btree ("age_group","order_index");--> statement-breakpoint
CREATE INDEX "tests_user_idx" ON "tests" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "tests_leaderboard_idx" ON "tests" USING btree ("score","total_time_ms");--> statement-breakpoint
CREATE INDEX "tests_experiment_idx" ON "tests" USING btree ("experiment_id");