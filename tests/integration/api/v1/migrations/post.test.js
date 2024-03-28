import database from "infra/database.js";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

test("POST to /api/v1/migrations should return 200", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  
  expect(response1.status).toBe(201); //espero um response created status
  
  const responseBody1 = await response1.json();

  expect(Array.isArray(responseBody1)).toBe(true); //espero que seja um array
  expect(responseBody1.length).toBeGreaterThan(0) //espero que ele não venha vazio
  
  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });

  expect(response2.status).toBe(200); //espero que a conexão seja bem sucedida e que nada seja criado
  const responseBody2 = await response2.json();
  expect(responseBody2.length).toBe(0) //espero que o array venha vazio já que a migrations já foi rodada no live-run
});
