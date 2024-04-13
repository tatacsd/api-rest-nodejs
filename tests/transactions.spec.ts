import { it, beforeAll, afterAll, describe, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { execSync } from "child_process";

describe("Transactions routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    app.close();
  });

  beforeEach(async () => {
    execSync("npm run knex:rollback");
    execSync("npm run knex:migrate");
  });

  it("should be able to create a new transaction", async () => {
    await request(app.server) // app.server is the http server instance
      .post("/transactions")
      .send({
        title: "Salary",
        amount: 1000,
        type: "deposit",
      })
      .expect(201); // 201 Created
  });

  it("should be able to list the transactions", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "Salary",
        amount: 1000,
        type: "deposit",
      });

    // get the cookies
    const cookies = createTransactionResponse.header["set-cookie"];

    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

    // Validate the response body content
    expect(listTransactionsResponse.body.transactions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Salary",
          amount: 1000,
        }),
      ])
    );
  });

  it("should be able to get a specific transaction", async () => {
    // Create a transaction
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "Salary",
        amount: 1000,
        type: "deposit",
      });
    // Get the cookies
    const cookies = createTransactionResponse.header["set-cookie"];
    // Get all transactions
    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);
    // Get a id from the transactions
    const transactionId = listTransactionsResponse.body.transactions[0].id;
    // Get the specific transaction
    const getTransactionByIdResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set("Cookie", cookies);

    // Validate the response body content
    expect(getTransactionByIdResponse.body).toEqual(
      expect.objectContaining({
        transaction: expect.objectContaining({
          id: transactionId,
          title: "Salary",
          amount: 1000,
        }),
      })
    );
  });

  it("should be able to get the summary", async () => {
    // Create a transaction
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "Salary",
        amount: 1000,
        type: "deposit",
      });
    // Get the cookies
    const cookies = createTransactionResponse.header["set-cookie"];

    // Create a transaction
    const createTransactionResponse2 = await request(app.server)
      .post("/transactions")
      .set("Cookie", cookies)
      .send({
        title: "Rent",
        amount: 800,
        type: "withdraw",
      });

    // Get summary
    const summaryResponse = await request(app.server)
      .get("/transactions/summary")
      .set("Cookie", cookies);

    // Validate the response body content
    expect(summaryResponse.body.summary).toEqual(
      expect.objectContaining({
        amount: 200,
      })
    );
  });
});
