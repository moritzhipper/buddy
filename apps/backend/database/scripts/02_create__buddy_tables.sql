CREATE TABLE "users_therapists" (
  "id" uuid UNIQUE PRIMARY KEY NOT NULL DEFAULT (gen_random_uuid()),
  "user_id" uuid NOT NULL,
  "name" VARCHAR(50) NOT NULL,
  "email" VARCHAR(50),
  "phone" VARCHAR(50),
  "free_from" DATE,
  "therapy_types" VARCHAR(50)[],
  "note" TEXT,
  "created_at" TIMESTAMP DEFAULT (now())
);

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

CREATE TABLE "subscriptions" (
  "id" uuid UNIQUE PRIMARY KEY NOT NULL DEFAULT (gen_random_uuid()),
  "user_id" uuid UNIQUE NOT NULL,
  "subscription" JSONB UNIQUE NOT NULL
);

CREATE TABLE "users" (
  "id" uuid UNIQUE PRIMARY KEY NOT NULL DEFAULT (gen_random_uuid()),
  "name" VARCHAR(30),
  "secret" uuid UNIQUE DEFAULT (gen_random_uuid()),
  "call_precaution_time" SMALLINT NOT NULL DEFAULT 15,
  "created_at" TIMESTAMP DEFAULT (now())
);

CREATE UNIQUE INDEX ON "users_therapists" ("id", "user_id");

CREATE INDEX ON "users_call_times" ("therapist_id", "from");

CREATE INDEX ON "users_addresses" ("therapist_id");

CREATE INDEX ON "shared_therapists" ("name");

CREATE INDEX ON "shared_call_times" ("therapist_id");

CREATE INDEX ON "shared_addresses" ("therapist_id");

ALTER TABLE "users_therapists" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "subscriptions" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "users_call_times" ADD FOREIGN KEY ("therapist_id") REFERENCES "users_therapists" ("id") ON DELETE CASCADE;

ALTER TABLE "users_addresses" ADD FOREIGN KEY ("therapist_id") REFERENCES "users_therapists" ("id") ON DELETE CASCADE;

ALTER TABLE "shared_addresses" ADD FOREIGN KEY ("therapist_id") REFERENCES "shared_therapists" ("id") ON DELETE CASCADE;

ALTER TABLE "shared_call_times" ADD FOREIGN KEY ("therapist_id") REFERENCES "shared_therapists" ("id") ON DELETE CASCADE;
