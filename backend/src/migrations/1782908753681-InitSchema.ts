import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1782908753681 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Enable UUID generation
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // ── users ────────────────────────────────────────────────────────────
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id"           UUID        NOT NULL DEFAULT uuid_generate_v4(),
                "email"        VARCHAR     NOT NULL,
                "passwordHash" VARCHAR     NOT NULL,
                "createdAt"    TIMESTAMP   NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_users_email" UNIQUE ("email"),
                CONSTRAINT "PK_users" PRIMARY KEY ("id")
            )
        `);

        // ── urls ─────────────────────────────────────────────────────────────
        await queryRunner.query(`
            CREATE TABLE "urls" (
                "id"          UUID            NOT NULL DEFAULT uuid_generate_v4(),
                "code"        VARCHAR         NOT NULL,
                "originalUrl" TEXT            NOT NULL,
                "clicks"      INTEGER         NOT NULL DEFAULT 0,
                "expiresAt"   TIMESTAMPTZ,
                "ownerId"     UUID            NOT NULL,
                "createdAt"   TIMESTAMP       NOT NULL DEFAULT now(),
                "updatedAt"   TIMESTAMP       NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_urls_code"    UNIQUE ("code"),
                CONSTRAINT "PK_urls"         PRIMARY KEY ("id"),
                CONSTRAINT "FK_urls_owner"   FOREIGN KEY ("ownerId")
                    REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);

        // ── clicks ───────────────────────────────────────────────────────────
        await queryRunner.query(`
            CREATE TABLE "clicks" (
                "id"        UUID        NOT NULL DEFAULT uuid_generate_v4(),
                "urlId"     UUID        NOT NULL,
                "clickedAt" TIMESTAMP   NOT NULL DEFAULT now(),
                "referer"   VARCHAR,
                "userAgent" VARCHAR,
                "ipHash"    VARCHAR,
                "country"   VARCHAR,
                CONSTRAINT "PK_clicks" PRIMARY KEY ("id"),
                CONSTRAINT "FK_clicks_url" FOREIGN KEY ("urlId")
                    REFERENCES "urls"("id") ON DELETE CASCADE
            )
        `);

        // Composite indexes used by analytics queries
        await queryRunner.query(`CREATE INDEX "IDX_clicks_urlId_clickedAt" ON "clicks" ("urlId", "clickedAt")`);
        await queryRunner.query(`CREATE INDEX "IDX_clicks_urlId_referer"   ON "clicks" ("urlId", "referer")`);
        await queryRunner.query(`CREATE INDEX "IDX_clicks_urlId"           ON "clicks" ("urlId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_clicks_urlId"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_clicks_urlId_referer"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_clicks_urlId_clickedAt"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "clicks"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "urls"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    }
}

