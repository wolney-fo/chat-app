import { app } from "./app";
import { env } from "./env";
import { connectDB } from "./database/mongo-client";

async function start() {
  await connectDB();
  await app.listen({ host: "0.0.0.0", port: env.PORT });
  console.log(`HTTP server running on port ${env.PORT}`);
}

start();
