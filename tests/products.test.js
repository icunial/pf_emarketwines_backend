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

let user1_id, admin_id;
let cookie;

describe("POST /users/register route -> create a no admin new user", () => {
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

describe("POST /users/register route -> create an admin new user", () => {
  it("it should return a 201 status code -> create new user successfully", async () => {
    const user = {
      email: "admin@ewines.com",
      username: "Admin",
      password: "Password14!",
      region: "Region One",
      phone: "12345678",
      password2: "Password14!",
    };

    const response = await request(app).post("/users/register").send(user);
    admin_id = response.body.data.id;
    expect(response.status).toBe(201);
    expect(response.body.data.email).toBe("admin@ewines.com");
  });
});

let varietal1_id;

describe("POST /varietals route -> Create new varietal success", () => {
  it("it should return a 200 status code -> admin user logged in", async () => {
    const user = {
      email: "admin@ewines.com",
      password: "Password14!",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
    cookie = response.headers["set-cookie"];
  });
  it("it should return 201 status code -> new varietal created", async () => {
    const varietal = {
      name: "Varietal 1",
      description: "Description Varietal 1",
    };
    const response = await request(app)
      .post("/varietals")
      .send(varietal)
      .set("Cookie", cookie);
    varietal1_id = response.body.data.id;
    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe("Varietal 1");
    expect(response.body.data.description).toBe("Description Varietal 1");
  });
  it("it should return a 200 status code -> logout process", async () => {
    const response = await request(app)
      .get("/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
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
  it("it should return 401 status code -> not authorized", async () => {
    const product = {
      type: "Type 1",
      varietal: "Varietal 1",
      origin: "Origin 1",
      cellar: "Cellar 1",
    };
    const response = await request(app).post("/products").send(product);
    expect(response.status).toBe(401);
    expect(response.body.msg).toBe("You are not authorized! Please login...");
  });
  it("it should return a 200 status code -> no admin user logged in", async () => {
    const user = {
      email: "user1@email.com",
      password: "Password14!",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
    cookie = response.headers["set-cookie"];
  });
  /*  it("it should return a 200 status code -> admin user logged in", async () => {
    const user = {
      email: "admin@ewines.com",
      password: "Password14!",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
    cookie = response.headers["set-cookie"];
  }); */
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

describe("GET /products route -> get all products", () => {
  it("it should return 200 status code -> get all products", async () => {
    const response = await request(app).get("/products");
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].name).toBe("Product 1");
    expect(response.body.data[0].varietal).toBe("Varietal 1");
  });
});

describe("GET /products/:id route -> get product by id", () => {
  it("it should return 400 status code -> id invalid format", async () => {
    const response = await request(app).get("/products/1");
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("ID invalid format!");
  });
  it("it should return 404 status code -> product not found", async () => {
    const response = await request(app).get(
      "/products/442d8a54-04f1-4d66-b1f6-6e0455bcf3e9"
    );
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(
      `Product with ID: 442d8a54-04f1-4d66-b1f6-6e0455bcf3e9 not found!`
    );
  });
  it("it should return 200 status code -> get product by id", async () => {
    const response = await request(app).get(`/products/${product1_id}`);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].name).toBe("Product 1");
    expect(response.body.data[0].id).toBe(product1_id);
    expect(response.body.data[0].varietal).toBe("Varietal 1");
  });
});
