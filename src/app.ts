import fastify from "fastify";
import cookie from "@fastify/cookie";

import { TransactionsRoutes } from "./routes/transactions";

export const app = fastify();

app.register(cookie);

app.register(TransactionsRoutes, { prefix: "/transactions" })
