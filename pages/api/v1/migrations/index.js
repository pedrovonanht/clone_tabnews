import MigrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";
import { createRouter } from "next-connect";
import { MethodNotAllowedError, InternalServerError } from "infra/errors";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler,
});

function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onErrorHandler(error, request, response) {
  const publicErrorObject = new InternalServerError({
    cause: error,
  });
  console.error(publicErrorObject);
  response.status(500).json(publicErrorObject);
}

const defaultMigrationOptions = {
      dryRun: true,
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

async function getHandler(request, response) {
  let dbClient = null;
  try {
    dbClient = await database.getNewClient();
    
      const pendingMigrations = await MigrationRunner({
        ...defaultMigrationOptions,
        dbClient
      });
      return response.status(200).json(pendingMigrations);
    
  } finally {
    await dbClient?.end();
  }
}

async function postHandler(request, response) {
let dbClient = null

  try {
     dbClient = await database.getNewClient();
      const migratedMigrations = await MigrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
        dbClient
      });
      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }
      return response.status(200).json(migratedMigrations);
    
  } finally {
    await dbClient?.end();
  }
}
