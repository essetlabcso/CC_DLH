import { mkdirSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

const repoRoot = process.cwd();
const prismaDir = join(repoRoot, "prisma");
const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";
const databasePath = resolveSqliteFilePath(databaseUrl);
const migrationsDir = join(prismaDir, "migrations");

mkdirSync(dirname(databasePath), { recursive: true });

const db = new DatabaseSync(databasePath);

try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "checksum" TEXT NOT NULL DEFAULT '',
      "finished_at" DATETIME,
      "migration_name" TEXT NOT NULL,
      "logs" TEXT,
      "rolled_back_at" DATETIME,
      "started_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "applied_steps_count" INTEGER NOT NULL DEFAULT 0
    );
  `);

  const migrations = readdirSync(migrationsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      id: entry.name,
      name: entry.name,
      path: join(migrationsDir, entry.name, "migration.sql"),
    }))
    .sort((left, right) => left.name.localeCompare(right.name));

  for (const migration of migrations) {
    const existing = db
      .prepare(
        `SELECT "id" FROM "_prisma_migrations" WHERE "migration_name" = ? AND "rolled_back_at" IS NULL`,
      )
      .get(migration.name);

    if (existing) {
      console.log(`Already applied: ${migration.name}`);
      continue;
    }

    const sql = readFileSync(migration.path, "utf8");

    db.exec("BEGIN");
    try {
      db.exec(sql);
      db.prepare(
        `INSERT INTO "_prisma_migrations" ("id", "migration_name", "finished_at", "applied_steps_count") VALUES (?, ?, CURRENT_TIMESTAMP, 1)`,
      ).run(migration.id, migration.name);
      db.exec("COMMIT");
      console.log(`Applied: ${migration.name}`);
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }

  console.log(`SQLite database ready: ${databasePath}`);
} finally {
  db.close();
}

function resolveSqliteFilePath(value) {
  if (!value.startsWith("file:")) {
    throw new Error("db:apply:local only supports SQLite file: DATABASE_URL values.");
  }

  const filePath = value.slice("file:".length);

  if (filePath.startsWith("/") || /^[A-Za-z]:[\\/]/.test(filePath)) {
    return resolve(filePath);
  }

  return resolve(prismaDir, filePath);
}
