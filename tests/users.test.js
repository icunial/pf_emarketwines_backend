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
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Email must be a string");
  });
  it("it should return a 400 status code -> email does not have a @", async () => {
    const user = {
      email: "user1email.com",
      password: "Password14!",
      username: "User 1",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Email format is not valid!");
  });
  it("it should return a 400 status code -> email format is not valid", async () => {
    const user = {
      email: "user1@emailcom",
      password: "Password14!",
      username: "User 1",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Email format is not valid!");
  });
  it("it should return a 400 status code -> email second part has a symbol", async () => {
    const user = {
      email: "user1@email.#com",
      password: "Password14!",
      username: "User 1",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Email format not valid");
  });
  it("it should return a 400 status code -> email second part has a number", async () => {
    const user = {
      email: "user1@email.1com",
      password: "Password14!",
      username: "User 1",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Email format not valid");
  });
  it("it should return a 400 status code -> username parameter is missing", async () => {
    const user = {
      email: "user1@email.com",
      password: "Password14!",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Username parameter is missing");
  });
  it("it should return a 400 status code -> username must be a string", async () => {
    const user = {
      email: "user1@email.com",
      username: 1234,
      password: "Password14!",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Username must be a string");
  });
  it("it should return a 400 status code -> region parameter is missing", async () => {
    const user = {
      email: "user1@email.com",
      username: "User One",
      password: "Password14!",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Region parameter is missing");
  });
  it("it should return a 400 status code -> region must be a string", async () => {
    const user = {
      email: "user1@email.com",
      username: "User One",
      password: "Password14!",
      region: 1234,
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Region must be a string");
  });
  it("it should return a 400 status code -> phone must be a string", async () => {
    const user = {
      email: "user1@email.com",
      username: "User One",
      password: "Password14!",
      region: "Region One",
      phone: 12345678,
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Phone must be a string");
  });
  it("it should return a 400 status code -> phone must contain only numbers", async () => {
    const user = {
      email: "user1@email.com",
      username: "User One",
      password: "Password14!",
      region: "Region One",
      phone: "12345678!",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Phone must contain only numbers");
  });
  it("it should return a 400 status code -> password confirmation parameter is missing", async () => {
    const user = {
      email: "user1@email.com",
      username: "User One",
      password: "Password14!",
      region: "Region One",
      phone: "12345678",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe(
      "Password Confirmation parameter is missing"
    );
  });
  it("it should return a 400 status code -> password confirmation must be a string", async () => {
    const user = {
      email: "user1@email.com",
      username: "User One",
      password: "Password14!",
      region: "Region One",
      phone: "12345678",
      password2: 1234,
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Password Confirmation must be a string");
  });
  it("it should return a 400 status code -> password confirmation must be 8 character long", async () => {
    const user = {
      email: "user1@email.com",
      username: "User One",
      password: "Password14!",
      region: "Region One",
      phone: "12345678",
      password2: "1234",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe(
      "Password Confirmation must be at least 8 character long"
    );
  });
});
