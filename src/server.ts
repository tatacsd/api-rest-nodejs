import fastify from "fastify";

const app = fastify();

app.get("/hello", async (request, reply) => {
  reply.send("Hello World");
});

app.listen({ port: 3333 }).then(() => {
  console.log(`Server listening on port 3333`);
});
