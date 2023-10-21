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
  it("it should return 400 status code -> type parameter is missing", async () => {
    const product = {
      name: "Product 1",
      varietal: "Varietal 1",
      origin: "Origin 1",
      cellar: "Cellar 1",
    };
    const response = await request(app).post("/products").send(product);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Type parameter is missing");
  });
  it("it should return 400 status code -> type must be a string", async () => {
    const product = {
      name: "Product 1",
      type: 1234,
      varietal: "Varietal 1",
      origin: "Origin 1",
      cellar: "Cellar 1",
    };
    const response = await request(app).post("/products").send(product);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Type must be a string");
  });
  it("it should return 400 status code -> varietal parameter is missing", async () => {
    const product = {
      name: "Product 1",
      type: "Type 1",
      origin: "Origin 1",
      cellar: "Cellar 1",
    };
    const response = await request(app).post("/products").send(product);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Varietal parameter is missing");
  });
  it("it should return 400 status code -> varietal must be a string", async () => {
    const product = {
      name: "Product 1",
      type: "Type 1",
      varietal: 1234,
      origin: "Origin 1",
      cellar: "Cellar 1",
    };
    const response = await request(app).post("/products").send(product);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Varietal must be a string");
  });
  it("it should return 400 status code -> origin parameter is missing", async () => {
    const product = {
      name: "Product 1",
      type: "Type 1",
      varietal: "Varietal 1",
      cellar: "Cellar 1",
    };
    const response = await request(app).post("/products").send(product);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Origin parameter is missing");
  });
  it("it should return 400 status code -> origin must be a string", async () => {
    const product = {
      name: "Product 1",
      type: "Type 1",
      varietal: "Varietal 1",
      origin: 1234,
      cellar: "Cellar 1",
    };
    const response = await request(app).post("/products").send(product);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Origin must be a string");
  });
  it("it should return 400 status code -> cellar parameter is missing", async () => {
    const product = {
      name: "Product 1",
      type: "Type 1",
      varietal: "Varietal 1",
      origin: "Origin 1",
    };
    const response = await request(app).post("/products").send(product);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Cellar parameter is missing");
  });
  it("it should return 400 status code -> cellar must be a string", async () => {
    const product = {
      name: "Product 1",
      type: "Type 1",
      varietal: "Varietal 1",
      origin: "Origin 1",
      cellar: 1234,
    };
    const response = await request(app).post("/products").send(product);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Cellar must be a string");
  });
  it("it should return 404 status code -> varietal not found", async () => {
    const product = {
      name: "Product 1",
      type: "Type 1",
      varietal: "Varietal 2",
      origin: "Origin 1",
      cellar: "Cellar",
    };
    const response = await request(app).post("/products").send(product);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(`Varietal ${product.varietal} not found!`);
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

describe("POST /products route -> product name exists validation", () => {
  it("it should return 400 status code -> product name exists", async () => {
    const product = {
      name: "Product 1",
      type: "Type 1",
      varietal: "Varietal 1",
      origin: "Origin 1",
      cellar: "Cellar",
    };
    const response = await request(app).post("/products").send(product);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe(
      `Name ${product.name} exists. Try with another one!`
    );
  });
});
