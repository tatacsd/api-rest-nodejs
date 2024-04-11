import { knex as setupKnex, Knex } from "knex";
import "dotenv/config";


if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set in .env");
}

if (!process.env.DATABASE_CLIENT) {
  throw new Error("DATABASE_CLIENT must be set in .env");
}

export const config: Knex.Config = {
  client: process.env.DATABASE_CLIENT,
  connection: {
    filename: process.env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations",
  },
};

export const knex = setupKnex(config);
