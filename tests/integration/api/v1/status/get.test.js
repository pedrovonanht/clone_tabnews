test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  //verify updated_at time
  const responseBody = await response.json();

  const ParsedUpdatedAt = new Date(responseBody.updated_at).toISOString(); //to garantee that the value is a date

  expect(responseBody.updated_at).toBeDefined();
  expect(responseBody.updated_at).toEqual(ParsedUpdatedAt); // to protect from a null object

  expect(responseBody.used_connections).toEqual(1); //em ambiente de produção já que só há um desenvolvedor o esperado é só 1 conexão

  expect(responseBody.max_connections).toEqual(100);

  expect(responseBody.version).toEqual("16.0");
  expect(responseBody.version).toBeDefined();
});