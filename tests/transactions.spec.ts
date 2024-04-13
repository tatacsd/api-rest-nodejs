import { it, beforeAll, afterAll, describe, expect} from "vitest";
import request from "supertest";
import { app } from "../src/app";

describe("Transactions routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    app.close();
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
          })
        ])
      );
  });
});
