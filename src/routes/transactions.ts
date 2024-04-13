import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";
import crypto from "node:crypto";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export async function TransactionsRoutes(app: FastifyInstance) {
 

  app.get(
    "/",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const sessionId = request.cookies.sessionId;

      const transactions = await knex("transactions").where({
        session_id: sessionId,
      }).select();
      console.log({ transactions });
      console.log({ sessionId });

      const allTransactions = await knex("transactions").select("*");
      console.log({ allTransactions });

      return reply.status(200).send({ transactions });
    }
  );

  app.get(
    "/:id",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getTransactionSchema = z.object({
        id: z.string().uuid(),
      });
      const { sessionId } = request.cookies;

      const { id } = getTransactionSchema.parse(request.params);

      const transaction = await knex("transactions")
        .select("*")
        .where({ id , session_id: sessionId })
        .first();

      if (!transaction) {
        return reply.status(404).send();
      }

      return reply.status(200).send({ transaction });
    }
  );

  app.get(
    "/summary",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies;
      const summary = await knex("transactions")
        .where({ session_id: sessionId })
        .sum("amount", { as: "amount" })
        .first();

      return reply.status(200).send({ summary });
    }
  );

  app.post("/", async (request, reply) => {
    const createTransactionSchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["deposit", "withdraw"]),
    });

    const { amount, title, type } = createTransactionSchema.parse(request.body);

    let {sessionId } = request.cookies;

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      reply.setCookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, //  7 days
      });
    }

    const _transaction = await knex("transactions").insert({
      id: crypto.randomUUID(),
      title,
      amount: type === "deposit" ? amount : amount * -1,
      session_id: sessionId,
    });

    console.log({ sessionId });
    console.log({ _transaction });

    return reply.status(201).send();
  });
}
