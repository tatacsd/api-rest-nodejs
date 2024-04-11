import fastify from "fastify";
import { knex } from "./database";
import crypto from "node:crypto";
import { env } from "./env";

const app = fastify();

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

app.listen({ port: env.PORT}).then(() => {
  console.log(`Server listening on port 3333`);
});
