import database from "infra/database.js";
import { InternalServerError } from "infra/errors.js";

async function status(request, response) {
  try {
    const updatedAt = new Date().toISOString();

    const DatabaseVersionResult = await database.query("SHOW server_version;");
    const DatabaseVersionValue = DatabaseVersionResult.rows[0].server_version;
    const maxConnectionsResult = await database.query("SHOW max_connections;");
    const maxConnectionsValue = maxConnectionsResult.rows[0].max_connections;

    const databaseName = process.env.POSTGRES_DB;

    const usedConnectionsResult = await database.query({
      text: "select count(*)::int from pg_stat_activity WHERE datname=$1;",
      values: [databaseName],
    });

    const used_connectionsValue = usedConnectionsResult.rows[0].count;

    response.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          max_connections: parseInt(maxConnectionsValue),
          used_connections: used_connectionsValue,
          version: DatabaseVersionValue,
        },
      },
    });
  } catch (error) {
    const publicErrorObject = new InternalServerError({
      cause: error,
    });

    console.log("\n Erro dentro do catch do controller: ");
    console.error(publicErrorObject);

    response.status(500).json(publicErrorObject);
  }
}

export default status;
