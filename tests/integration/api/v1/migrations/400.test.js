import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices()
  await database.query("drop schema public cascade; create schema public;");
});

test("bad method request should end connection and return 405", async () => {
  const migrationsResponse = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "DELETE",
  });

  const statusResponse = await fetch("http://localhost:3000/api/v1/status");
  const statusResponseBody = await statusResponse.json();
  expect(statusResponseBody.dependencies.database.used_connections).toBe(1);
  expect(migrationsResponse.status).toBe(405)
});
