import MigrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();
  const defaultMigrationOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };
  try {
    if (request.method === "GET") {
      const pendingMigrations = await MigrationRunner({
        ...defaultMigrationOptions,
      });
      return response.status(200).json(pendingMigrations);
    }
    if (request.method === "POST") {
      const migratedMigrations = await MigrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });
      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }

      return response.status(200).json(migratedMigrations);
    }
    return response.status(405).end();
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
