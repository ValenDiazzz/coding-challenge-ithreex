// src/routes/employees.js
import { Router } from "express";
import { pool } from "../db.js";

export const employeesRouter = Router();

// GET /employees  -> lista
employeesRouter.get("/", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, full_name, age, area, seniority_years, phone
       FROM employees
       ORDER BY area, full_name;`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /employees/:id  -> detalle
employeesRouter.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "id must be a positive integer" });
    }

    const { rows } = await pool.query(
      `SELECT id, full_name, age, area, seniority_years, phone
       FROM employees
       WHERE id = $1;`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});
