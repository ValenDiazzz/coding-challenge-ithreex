import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT
});

// Healthcheck simple
app.get("/", (_req, res) => res.json({ ok: true }));

// LISTADO de empleados
app.get("/employees", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, full_name, age, area, seniority_years, phone FROM employees ORDER BY area, full_name;"
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "DB error" });
  }
});

// DETALLE de empleado por id (opcional pero útil)
app.get("/employees/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, full_name, age, area, seniority_years, phone FROM employees WHERE id=$1;",
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "DB error" });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, '127.0.0.1', () =>
  console.log(`API running on http://127.0.0.1:${port}`)
);
