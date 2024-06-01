import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DO $$ BEGIN
 CREATE TYPE "enum_notes_status" AS ENUM('draft', 'published');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "enum_notes_blocks_reply_type_of_reply" AS ENUM('u-in-reply-to', 'u-like-of', 'u-repost-of', 'u-bookmark-of', 'u-mention-of');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "socials" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"email" varchar NOT NULL,
	"reset_password_token" varchar,
	"reset_password_expiration" timestamp(3) with time zone,
	"salt" varchar,
	"hash" varchar,
	"login_attempts" numeric,
	"lock_until" timestamp(3) with time zone
);

CREATE TABLE IF NOT EXISTS "notes_blocks_og" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"tag" varchar,
	"content" varchar,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "notes_blocks_reply" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"typeOfReply" "enum_notes_blocks_reply_type_of_reply",
	"reply_url" varchar,
	"reply_cite_title" varchar,
	"reply_cite_content" jsonb,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "notes_blocks_social_message" (
	"_order" integer NOT NULL,
	"_parent_id" integer NOT NULL,
	"_path" text NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"description" varchar,
	"share_to" boolean,
	"block_name" varchar
);

CREATE TABLE IF NOT EXISTS "notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" "enum_notes_status",
	"title_text" varchar NOT NULL,
	"title_visibility" boolean,
	"title_for_admin" varchar,
	"content" jsonb,
	"meta_description" varchar,
	"slug" varchar NOT NULL,
	"old_date" timestamp(3) with time zone,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "notes_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"media_id" integer,
	"tags_id" integer,
	"socials_id" integer
);

CREATE TABLE IF NOT EXISTS "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"alt" varchar NOT NULL,
	"caption" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"url" varchar,
	"filename" varchar,
	"mime_type" varchar,
	"filesize" numeric,
	"width" numeric,
	"height" numeric
);

CREATE TABLE IF NOT EXISTS "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar,
	"slug" varchar NOT NULL,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "payload_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar,
	"value" jsonb,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"users_id" integer
);

CREATE TABLE IF NOT EXISTS "payload_migrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"batch" numeric,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "created_at_idx" ON "socials" ("created_at");
CREATE INDEX IF NOT EXISTS "created_at_idx" ON "users" ("created_at");
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "users" ("email");
CREATE INDEX IF NOT EXISTS "order_idx" ON "notes_blocks_og" ("_order");
CREATE INDEX IF NOT EXISTS "parent_id_idx" ON "notes_blocks_og" ("_parent_id");
CREATE INDEX IF NOT EXISTS "path_idx" ON "notes_blocks_og" ("_path");
CREATE INDEX IF NOT EXISTS "order_idx" ON "notes_blocks_reply" ("_order");
CREATE INDEX IF NOT EXISTS "parent_id_idx" ON "notes_blocks_reply" ("_parent_id");
CREATE INDEX IF NOT EXISTS "path_idx" ON "notes_blocks_reply" ("_path");
CREATE INDEX IF NOT EXISTS "order_idx" ON "notes_blocks_social_message" ("_order");
CREATE INDEX IF NOT EXISTS "parent_id_idx" ON "notes_blocks_social_message" ("_parent_id");
CREATE INDEX IF NOT EXISTS "path_idx" ON "notes_blocks_social_message" ("_path");
CREATE INDEX IF NOT EXISTS "created_at_idx" ON "notes" ("created_at");
CREATE INDEX IF NOT EXISTS "order_idx" ON "notes_rels" ("order");
CREATE INDEX IF NOT EXISTS "parent_idx" ON "notes_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "path_idx" ON "notes_rels" ("path");
CREATE INDEX IF NOT EXISTS "created_at_idx" ON "media" ("created_at");
CREATE UNIQUE INDEX IF NOT EXISTS "filename_idx" ON "media" ("filename");
CREATE INDEX IF NOT EXISTS "created_at_idx" ON "tags" ("created_at");
CREATE INDEX IF NOT EXISTS "created_at_idx" ON "payload_preferences" ("created_at");
CREATE INDEX IF NOT EXISTS "order_idx" ON "payload_preferences_rels" ("order");
CREATE INDEX IF NOT EXISTS "parent_idx" ON "payload_preferences_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "path_idx" ON "payload_preferences_rels" ("path");
CREATE INDEX IF NOT EXISTS "created_at_idx" ON "payload_migrations" ("created_at");
DO $$ BEGIN
 ALTER TABLE "notes_blocks_og" ADD CONSTRAINT "notes_blocks_og__parent_id_notes_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "notes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "notes_blocks_reply" ADD CONSTRAINT "notes_blocks_reply__parent_id_notes_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "notes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "notes_blocks_social_message" ADD CONSTRAINT "notes_blocks_social_message__parent_id_notes_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "notes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "notes_rels" ADD CONSTRAINT "notes_rels_parent_id_notes_id_fk" FOREIGN KEY ("parent_id") REFERENCES "notes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "notes_rels" ADD CONSTRAINT "notes_rels_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "notes_rels" ADD CONSTRAINT "notes_rels_tags_id_tags_id_fk" FOREIGN KEY ("tags_id") REFERENCES "tags"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "notes_rels" ADD CONSTRAINT "notes_rels_socials_id_socials_id_fk" FOREIGN KEY ("socials_id") REFERENCES "socials"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_id_payload_preferences_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_id_users_id_fk" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DROP TABLE "socials";
DROP TABLE "users";
DROP TABLE "notes_blocks_og";
DROP TABLE "notes_blocks_reply";
DROP TABLE "notes_blocks_social_message";
DROP TABLE "notes";
DROP TABLE "notes_rels";
DROP TABLE "media";
DROP TABLE "tags";
DROP TABLE "payload_preferences";
DROP TABLE "payload_preferences_rels";
DROP TABLE "payload_migrations";`);

};
