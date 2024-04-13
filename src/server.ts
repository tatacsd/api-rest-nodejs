import fastify from "fastify";
import { knex } from "./database";
import crypto from "node:crypto";
import { env } from "./env";
import { TransactionsRoutes } from "./routes/transactions";
import cookie from "@fastify/cookie";

const app = fastify();
app.register(cookie);
app.register(TransactionsRoutes, { prefix: "/transactions" })

app.listen({ port: env.PORT}).then(() => {
  console.log(`Server listening on port 3333`);
});
