import dotenv from "dotenv";
import { buildApp } from "./src/app.js";
import { pool } from "./src/db.js";

dotenv.config();

const port = Number(process.env.PORT) || 5000;
const host = "127.0.0.1";

const app = buildApp();
const server = app.listen(port, host, () => {
  console.log(`API running on http://${host}:${port}`);
});

async function shutdown(signal) {
  try {
    console.log(`\n${signal} received. Shutting down...`);
    server.close(() => console.log("HTTP server closed."));
    await pool.end();
    console.log("DB pool closed.");
    process.exit(0);
  } catch (e) {
    console.error("Error during shutdown:", e);
    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
