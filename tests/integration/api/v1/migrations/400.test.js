import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("drop schema public cascade; create schema public;");
});
describe("DELETE /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Running pending migrations", async () => {
      const migrationsResponse = await fetch(
        "http://localhost:3000/api/v1/migrations",
        {
          method: "DELETE", // trying to run with a invalid method
        },
      );

      const statusResponse = await fetch("http://localhost:3000/api/v1/status");
      const statusResponseBody = await statusResponse.json();
      expect(statusResponseBody.dependencies.database.used_connections).toBe(1);
      expect(migrationsResponse.status).toBe(405);
    });
  });
});
