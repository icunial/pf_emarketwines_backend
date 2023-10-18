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

describe("POST /register route", () => {
  it("it should return a 400 status code -> password parameter is missing", async () => {
    const user = {
      email: "user1@email.com",
      username: "User 1",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Password parameter is missing");
  });
  it("it should return a 400 status code -> password must be a string", async () => {
    const user = {
      password: 123,
      email: "user1@email.com",
      username: "User 1",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Password must be a string");
  });
  it("it should return a 400 status code -> password must be at least 8 characters long", async () => {
    const user = {
      password: "1234",
      email: "user1@email.com",
      username: "User 1",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe(
      "Password must be at least 8 character long"
    );
  });
  it("it should return a 400 status code -> password must have one capital letter", async () => {
    const user = {
      password: "password",
      email: "user1@email.com",
      username: "User 1",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Password must have one capital letter");
  });
  it("it should return a 400 status code -> password must have one number", async () => {
    const user = {
      password: "Password",
      email: "user1@email.com",
      username: "User 1",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Password must have one number");
  });
  it("it should return a 400 status code -> password must have one symbol", async () => {
    const user = {
      password: "Password14",
      email: "user1@email.com",
      username: "User 1",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Password must have one symbol");
  });
  it("it should return a 400 status code -> email parameter is missing", async () => {
    const user = {
      password: "Password14!",
      username: "User 1",
    };

    const response = await request(app).post("/users/register").send(user);
    console.log(response);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Email parameter is missing");
  });
  it("it should return a 400 status code -> email must be a string", async () => {
    const user = {
      email: 1234,
      password: "Password14!",
      username: "User 1",
    };

    const response = await request(app).post("/users/register").send(user);
    console.log(response);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Email must be a string");
  });
});
