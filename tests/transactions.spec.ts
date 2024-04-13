import { test, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../src/app";

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  app.close();
});

test("The user should create a transaction", async () => {
  await request(app.server) // app.server is the http server instance
    .post("/transactions") 
    .send({ 
      title: "Salary",
      amount: 1000,
      type: "deposit",
    })
    .expect(201); // 201 Created
});
