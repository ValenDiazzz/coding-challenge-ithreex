// src/app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { pool } from "./db.js";
import { employeesRouter } from "./routes/employees.js";

export function buildApp() {
  const app = express();

  // Middlewares base
  app.use(helmet());            // headers de seguridad
  app.use(cors());              // en prod, restringí origin
  app.use(express.json());      // body-parser JSON
  app.use(pinoHttp());          // logging HTTP

  // Healthchecks
  app.get("/", (_req, res) => res.json({ ok: true })); // liveness
  app.get("/health", async (_req, res) => {            // readiness (DB)
    try {
      await pool.query("SELECT 1");
      res.json({ ok: true, db: true });
    } catch {
      res.status(503).json({ ok: false, db: false });
    }
  });

  // Rutas
  app.use("/employees", employeesRouter);

  // Error handler global
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    // log detallado ya lo hace pinoHttp; opcional console.error:
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}
