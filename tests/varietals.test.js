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

let user1_id;

describe("POST /users/register route -> create new user", () => {
  it("it should return a 201 status code -> create new user successfully", async () => {
    const user = {
      email: "user1@email.com",
      username: "User One",
      password: "Password14!",
      region: "Region One",
      phone: "12345678",
      password2: "Password14!",
    };

    const response = await request(app).post("/users/register").send(user);
    user1_id = response.body.data.id;
    expect(response.status).toBe(201);
    expect(response.body.data.email).toBe("user1@email.com");
  });
});

let cookie;

describe("POST /users/login route -> login process", () => {
  it("it should return a 200 status code -> user logged in", async () => {
    const user = {
      email: "user1@email.com",
      password: "Password14!",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
    cookie = response.headers["set-cookie"];
  });
});

describe("GET /varietals route -> no varietals saved in DB", () => {
  it("it should return 404 status code -> no varietals saved in DB", async () => {
    const response = await request(app).get("/varietals");
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("No varietals saved in DB!");
  });
});

describe("POST /varietals route -> Create new varietal validations", () => {
  it("it should return 400 status code -> name parameter is missing", async () => {
    const varietal = {
      description: "Description Varietal 1",
    };

    const response = await request(app).post("/varietals").send(varietal);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Name parameter is missing");
  });
  it("it should return 400 status code -> name must be a string", async () => {
    const varietal = {
      name: 1234,
      description: "Description Varietal 1",
    };

    const response = await request(app).post("/varietals").send(varietal);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Name must be a string");
  });
  it("it should return 400 status code -> description parameter is missing", async () => {
    const varietal = {
      name: "Varietal 1",
    };

    const response = await request(app).post("/varietals").send(varietal);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Description parameter is missing");
  });
  it("it should return 400 status code -> description must be a string", async () => {
    const varietal = {
      name: "Varietal 1",
      description: 1234,
    };

    const response = await request(app).post("/varietals").send(varietal);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Description must be a string");
  });
});
