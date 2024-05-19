CREATE TABLE "notes" (
  "id" uuid UNIQUE PRIMARY KEY DEFAULT (gen_random_uuid()),
  "user_id" uuid NOT NULL,
  "body" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT (now()),
  "is_important" BOOLEAN DEFAULT false
);

CREATE TABLE "goals" (
  "id" uuid UNIQUE PRIMARY KEY DEFAULT (gen_random_uuid()),
  "user_id" uuid NOT NULL,
  "body" VARCHAR(60) NOT NULL,
  "created_at" TIMESTAMP DEFAULT (now())
);

w

CREATE TABLE "users_call_times" (
  "therapist_id" uuid NOT NULL,
  "from" VARCHAR(5) NOT NULL,
  "to" VARCHAR(5) NOT NULL,
  "weekday" VARCHAR(2) NOT NULL,
  "reminder" BOOLEAN DEFAULT false
);

CREATE TABLE "users_addresses" (
  "therapist_id" uuid UNIQUE,
  "street" VARCHAR(255),
  "number" VARCHAR(8),
  "city" VARCHAR(50),
  "postal_code" VARCHAR(10)
);

CREATE TABLE "shared_therapists" (
  "id" uuid UNIQUE PRIMARY KEY NOT NULL DEFAULT (gen_random_uuid()),
  "name" VARCHAR(50) NOT NULL,
  "email" VARCHAR(50),
  "phone" VARCHAR(50),
  "therapy_types" VARCHAR(50)[]
);

CREATE TABLE "shared_call_times" (
  "therapist_id" uuid NOT NULL,
  "from" VARCHAR(5) NOT NULL,
  "to" VARCHAR(5) NOT NULL,
  "weekday" VARCHAR(2) NOT NULL
);

CREATE TABLE "shared_addresses" (
  "therapist_id" uuid UNIQUE,
  "street" VARCHAR(255),
  "number" VARCHAR(8),
  "city" VARCHAR(50),
  "postal_code" VARCHAR(10)
);

CREATE TABLE "app_settings" (
  "user_id" uuid PRIMARY KEY NOT NULL,
  "call_precaution_time" SMALLINT NOT NULL DEFAULT 15,
  "appointment_precaution_time" SMALLINT NOT NULL DEFAULT 60,
  "share_therapist_data" BOOLEAN NOT NULL DEFAULT true,
  "remind_next_appointment" BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE "sessions" (
  "user_id" uuid NOT NULL,
  "id" TEXT UNIQUE NOT NULL,
  "ip" CIDR NOT NULL,
  "created_by_full_user" BOOLEAN DEFAULT false,
  "created_at" TIMESTAMP DEFAULT (now())
);

CREATE TABLE "users" (
  "id" uuid UNIQUE PRIMARY KEY NOT NULL DEFAULT (gen_random_uuid()),
  "name" VARCHAR(30),
  "secret" uuid UNIQUE DEFAULT (gen_random_uuid()),
  "password" TEXT,
  "email" VARCHAR(50) UNIQUE,
  "is_full_user" BOOLEAN DEFAULT false,
  "created_at" TIMESTAMP DEFAULT (now())
);

CREATE TABLE "appointments" (
  "id" uuid UNIQUE PRIMARY KEY DEFAULT (gen_random_uuid()),
  "user_id" uuid NOT NULL,
  "therapist_id" uuid,
  "is_repeating" boolean,
  "weekday" VARCHAR(2),
  "date" DATE,
  "from" VARCHAR(5),
  "to" VARCHAR(5)
);

CREATE UNIQUE INDEX ON "users_therapists" ("id", "user_id");

CREATE INDEX ON "users_call_times" ("therapist_id");

CREATE INDEX ON "users_addresses" ("therapist_id");

CREATE INDEX ON "shared_call_times" ("therapist_id");

CREATE INDEX ON "shared_addresses" ("therapist_id");

CREATE UNIQUE INDEX ON "sessions" ("user_id", "ip");

ALTER TABLE "app_settings" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "notes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "goals" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "appointments" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "users_therapists" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "sessions" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "appointments" ADD FOREIGN KEY ("therapist_id") REFERENCES "users_therapists" ("id") ON DELETE CASCADE;

ALTER TABLE "users_call_times" ADD FOREIGN KEY ("therapist_id") REFERENCES "users_therapists" ("id") ON DELETE CASCADE;

ALTER TABLE "users_addresses" ADD FOREIGN KEY ("therapist_id") REFERENCES "users_therapists" ("id") ON DELETE CASCADE;

ALTER TABLE "shared_addresses" ADD FOREIGN KEY ("therapist_id") REFERENCES "shared_therapists" ("id") ON DELETE CASCADE;

ALTER TABLE "shared_call_times" ADD FOREIGN KEY ("therapist_id") REFERENCES "shared_therapists" ("id") ON DELETE CASCADE;
