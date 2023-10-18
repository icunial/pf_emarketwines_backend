const request = require("supertest");
const app = require("../index");
const db = require("../src/db");
const User = require("../src/models/User");

beforeAll(async () => {
  await db.sync({ force: true });
});

afterAll((done) => {
  db.close();
  done();
});

describe("Users table is Empty", () => {
  it("it should return 404 status code -> no users saved in database", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("No users saved in DB!");
  });
});
