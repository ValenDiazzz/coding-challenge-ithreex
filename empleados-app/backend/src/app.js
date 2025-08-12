import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { pool } from "./db.js";
import { employeesRouter } from "./routes/employees.js";

export function buildApp() {
  const app = express();

  // Middlewares base
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(pinoHttp());

  // Healthchecks
  app.get("/", (_req, res) => res.json({ ok: true }));
  app.get("/health", async (_req, res) => {
    try {
      await pool.query("SELECT 1");
      res.json({ ok: true, db: true });
    } catch {
      res.status(503).json({ ok: false, db: false });
    }
  });

  // Routes
  app.use("/employees", employeesRouter);

  // Error handler global
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}
