const request = require("supertest");
const app = require("../index");
const db = require("../src/db");

beforeAll(async () => {
  await db.sync({ force: true });
  // await Product.truncate()
});

afterAll((done) => {
  db.close();
  done();
});

let varietal1_id;

describe("POST /varietals route -> Create new varietal success", () => {
  it("it should return 201 status code -> new varietal created", async () => {
    const varietal = {
      name: "Varietal 1",
      description: "Description Varietal 1",
    };
    const response = await request(app).post("/varietals").send(varietal);
    varietal1_id = response.body.data.id;
    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe("Varietal 1");
    expect(response.body.data.description).toBe("Description Varietal 1");
  });
});

describe("GET /products route -> no products saved in DB", () => {
  it("it should return 404 status code -> no products saved in DB", async () => {
    const response = await request(app).get("/products");
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("No products saved in DB");
  });
});

describe("POST /products route -> create new product validations", () => {
  it("it should return 400 status code -> name parameter is missing", async () => {
    const product = {
      type: "Type 1",
      varietal: "Varietal 1",
      origin: "Origin 1",
      cellar: "Cellar 1",
    };
    const response = await request(app).post("/products").send(product);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Name parameter is missing");
  });
  it("it should return 400 status code -> name must be a string", async () => {
    const product = {
      name: 1234,
      type: "Type 1",
      varietal: "Varietal 1",
      origin: "Origin 1",
      cellar: "Cellar 1",
    };
    const response = await request(app).post("/products").send(product);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Name must be a string");
  });
});
