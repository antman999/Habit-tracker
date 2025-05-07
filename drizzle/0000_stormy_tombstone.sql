CREATE TABLE "completions" (
	"id" serial PRIMARY KEY NOT NULL,
	"habit_id" serial NOT NULL,
	"date" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "habits" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "completions" ADD CONSTRAINT "completions_habit_id_fk" FOREIGN KEY ("habit_id") REFERENCES "public"."habits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "completions_habit_id_date_unq" ON "completions" USING btree ("habit_id","date");--> statement-breakpoint
CREATE INDEX "completions_habit_id_idx" ON "completions" USING btree ("habit_id");--> statement-breakpoint
CREATE INDEX "completions_date_idx" ON "completions" USING btree ("date");--> statement-breakpoint
CREATE INDEX "habits_user_id_idx" ON "habits" USING btree ("user_id");