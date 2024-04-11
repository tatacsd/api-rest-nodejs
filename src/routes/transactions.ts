import { FastifyInstance } from "fastify";
import { knex } from "../database";

export async function TransactionsRoutes(app: FastifyInstance) {
    app.get("/hello", async (request, reply) => {
        // const transaction = await knex("transactions").insert({
        //   id: crypto.randomUUID(),
        //   title: "Test transaction",
        //   amount: 100,
        //   session_id: crypto.randomUUID(),
        // }).returning("*");
      
        // const transaction = await knex("transactions").select("*");
      
        const transaction = await knex("transactions")
        .where("id", "a6237fd7-cbfa-4eca-a061-ab3de3949905")
        .select("*");
      
        return transaction;
      });

}