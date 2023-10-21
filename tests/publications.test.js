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

let product1_id;

describe("POST /products route -> create new product success", () => {
  it("it should return 201 status code -> new product created", async () => {
    const product = {
      name: "Product 1",
      type: "Type 1",
      varietal: "Varietal 1",
      origin: "Origin 1",
      cellar: "Cellar",
    };
    const response = await request(app).post("/products").send(product);
    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe("Product 1");
    product1_id = response.body.data.id;
  });
});

describe("GET /publications route -> no publications saved in DB", () => {
  it("it should return 404 status code -> no publications saved in DB", async () => {
    const response = await request(app).get("/publications");
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("No publications saved in DB!");
  });
});

describe("POST /publications route -> create new publication validations", () => {
  it("it should return 400 status code -> title parameter is missing", async () => {
    const publication = {
      price: 100,
      amount: 100,
      description: "Description Publication 1",
    };

    const response = await request(app).post("/publications").send(publication);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Title parameter is missing");
  });
  it("it should return 400 status code -> title must be a string", async () => {
    const publication = {
      title: 1234,
      price: 100,
      amount: 100,
      description: "Description Publication 1",
    };

    const response = await request(app).post("/publications").send(publication);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Title must be a string");
  });
  it("it should return 400 status code -> price parameter is missing", async () => {
    const publication = {
      title: "Publication 1",
      amount: 100,
      description: "Description Publication 1",
    };

    const response = await request(app).post("/publications").send(publication);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Price parameter is missing");
  });
  it("it should return 400 status code -> price must be a number", async () => {
    const publication = {
      title: "Publication 1",
      price: true,
      amount: 100,
      description: "Description Publication 1",
    };

    const response = await request(app).post("/publications").send(publication);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Price must be a number");
  });
  it("it should return 400 status code -> price must be higher than 0", async () => {
    const publication = {
      title: "Publication 1",
      price: 0,
      amount: 100,
      description: "Description Publication 1",
    };

    const response = await request(app).post("/publications").send(publication);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Price must be higher than 0");
  });
  it("it should return 400 status code -> amount parameter is missing", async () => {
    const publication = {
      title: "Publication 1",
      price: 100,
      description: "Description Publication 1",
    };

    const response = await request(app).post("/publications").send(publication);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Amount parameter is missing");
  });
});
