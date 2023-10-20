const request = require("supertest");
const app = require("../index");
const db = require("../src/db");

beforeAll(async () => {
  await db.sync({ force: true });
});

afterAll((done) => {
  db.close();
  done();
});
