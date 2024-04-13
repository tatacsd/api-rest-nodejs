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

        let session = request.cookies.session;

        if (!session) {
            session = crypto.randomUUID();
            reply.setCookie("session", session, {
                path: "/",
                maxAge: 60 * 60 * 24 * 7, //  7 days
            });
        }
    

        await knex("transactions").insert({
            id: crypto.randomUUID(),
            title,
            amount: type ==="deposit" ? amount : amount * -1,
        });

        return reply.status(201).send();
      });

      app.get("/", async (request, reply) => {
        const transactions = await knex("transactions").select("*");

        return reply.status(200).send({ transactions });
      });

      app.get("/:id", async (request, reply) => {
        const getTransactionSchema = z.object({
            id: z.string().uuid(),
        });

        const { id } = getTransactionSchema.parse(request.params);

        const transaction = await knex("transactions").select("*").where({ id }).first();

        if (!transaction) {
            return reply.status(404).send();
        }

        return reply.status(200).send({ transaction });
      });


      app.get("/summary", async (request, reply) => {
        const summary = await knex("transactions").sum("amount", { as: "amount" }).first();

        return reply.status(200).send({ summary });
      });
}