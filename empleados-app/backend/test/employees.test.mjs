import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { buildApp } from "../src/app.js";
import { pool } from "../src/db.js";

const app = buildApp();

test("GET / -> liveness", async () => {
  const res = await request(app).get("/").expect(200);
  assert.equal(res.body.ok, true);
});

test("GET /health -> readiness con DB", async () => {
  const res = await request(app).get("/health").expect(200);
  assert.deepEqual(res.body, { ok: true, db: true });
});

test("GET /employees -> devuelve lista con campos esperados", async () => {
  const res = await request(app).get("/employees").expect(200);
  assert.ok(Array.isArray(res.body));
  assert.ok(res.body.length >= 1);
  const e = res.body[0];
  for (const k of ["id","full_name","age","area","seniority_years","phone"]) {
    assert.ok(k in e);
  }
});

test("GET /employees/1 -> detalle OK", async () => {
  const res = await request(app).get("/employees/1").expect(200);
  assert.equal(res.body.id, 1);
});

test("GET /employees/99999 -> 404", async () => {
  await request(app).get("/employees/99999").expect(404);
});

test("GET /employees/abc -> 400", async () => {
  await request(app).get("/employees/abc").expect(400);
});

test.after(async () => {
  await pool.end(); // cerrar pool
});
