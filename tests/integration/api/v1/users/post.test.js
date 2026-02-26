import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";
import user from "models/user.js";
import password from "models/password";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});
describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "prames",
          email: "adminmail@gmail.com",
          password: "senha123",
        }),
      });
      expect(response.status).toBe(201); //espero um response created status

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "prames",
        email: "adminmail@gmail.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const userInDatabase = await user.findOneByUsername("prames");
      const correctPasswordMatch = await password.compare(
        "senha123",
        userInDatabase.password,
      );
      const incorrectPasswordMatch = await password.compare(
        "senhaErrada",
        userInDatabase.password,
      );

      expect(correctPasswordMatch).toBe(true);
      expect(incorrectPasswordMatch).toBe(false);
    });
    test("Duplicated 'email'", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailduplicado1",
          email: "duplicado@gmail.com",
          password: "senha123",
        }),
      });
      expect(response1.status).toBe(201); //espero um response created status
      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailduplicado2",
          email: "Duplicado@gmail.com",
          password: "senha123",
        }),
      });
      expect(response2.status).toBe(400); //espero um response created status

      const response2Body = await response2.json();
      expect(response2Body).toEqual({
        name: "ValidationError",
        action: "Utilize outro email para realizar esta operação.",
        message: "O email informado já está sendo utilizado.",
        statusCode: 400,
      });
    });
    test("Duplicated 'username'", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "usernameduplicado",
          email: "usernameduplicado1@gmail.com",
          password: "senha123",
        }),
      });
      expect(response1.status).toBe(201); //espero um response created status
      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "Usernameduplicado",
          email: "usernameduplicado2@gmail.com",
          password: "senha123",
        }),
      });
      expect(response2.status).toBe(400); //espero um response created status

      const response2Body = await response2.json();
      expect(response2Body).toEqual({
        name: "ValidationError",
        action: "Utilize outro username para realizar esta operação.",
        message: "O username informado já está sendo utilizado.",
        statusCode: 400,
      });
    });
  });
});
