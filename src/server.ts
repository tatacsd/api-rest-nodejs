import { env } from "./env";
import { app } from "./app";

app.listen({ port: env.PORT}).then(() => {
  console.log(`Server listening on port 3333`);
});
