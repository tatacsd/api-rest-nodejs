import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";
import crypto from "node:crypto";

export async function TransactionsRoutes(app: FastifyInstance) {
    app.post("/", async (request, reply) => {
        const createTransactionSchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(["deposit", "withdraw"]),
        });

        const {amount, title, type} = createTransactionSchema.parse(request.body);

        await knex("transactions").insert({
            id: crypto.randomUUID(),
            title,
            amount: type ==="deposit" ? amount : amount * -1,
        });

        return reply.status(201).send();
      });

}