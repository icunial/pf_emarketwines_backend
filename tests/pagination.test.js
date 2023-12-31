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

let user1_id, user2_id, admin_id;
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
  it("it should return a 201 status code -> create new user successfully", async () => {
    const user = {
      email: "user2@email.com",
      username: "User Two",
      password: "Password14!",
      region: "Region Two",
      phone: "12345678",
      password2: "Password14!",
    };

    const response = await request(app).post("/users/register").send(user);
    user2_id = response.body.data.id;
    expect(response.status).toBe(201);
    expect(response.body.data.email).toBe("user2@email.com");
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

let varietal1_id, varietal2_id;

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
  it("it should return 201 status code -> new varietal created", async () => {
    const varietal = {
      name: "Varietal 2",
      description: "Description Varietal 2",
    };
    const response = await request(app)
      .post("/varietals")
      .send(varietal)
      .set("Cookie", cookie);
    varietal2_id = response.body.data.id;
    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe("Varietal 2");
    expect(response.body.data.description).toBe("Description Varietal 2");
  });
});

let product1_id, product2_id;

describe("POST /products route -> create new product success", () => {
  it("it should return 201 status code -> new product created", async () => {
    const product = {
      name: "Product 1",
      type: "Type 1",
      varietal: "Varietal 1",
      origin: "Origin 1",
      cellar: "Cellar 1",
    };
    const response = await request(app)
      .post("/products")
      .send(product)
      .set("Cookie", cookie);
    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe("Product 1");
    product1_id = response.body.data.id;
  });
  it("it should return 201 status code -> new product created", async () => {
    const product = {
      name: "Product 2",
      type: "Type 2",
      varietal: "Varietal 2",
      origin: "Origin 2",
      cellar: "Cellar 2",
    };
    const response = await request(app)
      .post("/products")
      .send(product)
      .set("Cookie", cookie);
    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe("Product 2");
    product2_id = response.body.data.id;
  });
  it("it should return a 200 status code -> logout process", async () => {
    const response = await request(app)
      .get("/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
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
  it("it should return 401 status code -> not authorized", async () => {
    const publication = {
      title: "Publication 1",
      price: 100,
      amount: 100,
      description: "Description Publication 1",
      product: "Product 1",
    };
    const response = await request(app).post("/publications").send(publication);
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
  it("it should return 400 status code -> title parameter is missing", async () => {
    const publication = {
      price: 100,
      amount: 100,
      description: "Description Publication 1",
    };

    const response = await request(app)
      .post("/publications")
      .send(publication)
      .set("Cookie", cookie);
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

    const response = await request(app)
      .post("/publications")
      .send(publication)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Title must be a string");
  });
  it("it should return 400 status code -> price parameter is missing", async () => {
    const publication = {
      title: "Publication 1",
      amount: 100,
      description: "Description Publication 1",
    };

    const response = await request(app)
      .post("/publications")
      .send(publication)
      .set("Cookie", cookie);
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

    const response = await request(app)
      .post("/publications")
      .send(publication)
      .set("Cookie", cookie);
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

    const response = await request(app)
      .post("/publications")
      .send(publication)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Price must be higher than 0");
  });
  it("it should return 400 status code -> amount parameter is missing", async () => {
    const publication = {
      title: "Publication 1",
      price: 100,
      description: "Description Publication 1",
    };

    const response = await request(app)
      .post("/publications")
      .send(publication)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Amount parameter is missing");
  });
  it("it should return 400 status code -> amount must be a number", async () => {
    const publication = {
      title: "Publication 1",
      price: 100,
      amount: "Hola",
      description: "Description Publication 1",
    };

    const response = await request(app)
      .post("/publications")
      .send(publication)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Amount must be a number");
  });
  it("it should return 400 status code -> amount must be higher than 0", async () => {
    const publication = {
      title: "Publication 1",
      price: 100,
      amount: -100,
      description: "Description Publication 1",
    };

    const response = await request(app)
      .post("/publications")
      .send(publication)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Amount must be higher than 0");
  });
  it("it should return 400 status code -> description parameter is missing", async () => {
    const publication = {
      title: "Publication 1",
      price: 100,
      amount: 100,
    };

    const response = await request(app)
      .post("/publications")
      .send(publication)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Description parameter is missing");
  });
  it("it should return 400 status code -> description must be a string", async () => {
    const publication = {
      title: "Publication 1",
      price: 100,
      amount: 100,
      description: 1234,
    };

    const response = await request(app)
      .post("/publications")
      .send(publication)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Description must be a string");
  });
});

describe("POST /publications route -> product validations", () => {
  it("it should return 404 status code -> product not found", async () => {
    const publication = {
      title: "Publication 1",
      price: 100,
      amount: 100,
      description: "Description Publication 1",
      product: "Product 3",
    };

    const response = await request(app)
      .post("/publications")
      .send(publication)
      .set("Cookie", cookie);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("Product Product 3 not found!");
  });
});

/*************** */

describe("POST /publications route -> create new publication success", () => {
  for (let x = 1; x <= 50; x++) {
    it("it should return 201 status code -> new publication success", async () => {
      const publication = {
        title: `Publication ${x}`,
        price: 100,
        amount: 100,
        description: `Description Publication ${x}`,
        product: "Product 1",
      };

      const response = await request(app)
        .post("/publications")
        .send(publication)
        .set("Cookie", cookie);
      expect(response.status).toBe(201);
    });
  }

  it("it should return 200 status code -> logout process", async () => {
    const response = await request(app)
      .get("/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });
});

describe("GET /pagination route -> get not banned publications with pagination", () => {
  it("it should return 200 status code -> get total publications and total pages", async () => {
    const response = await request(app).get("/publications/pagination");
    expect(response.status).toBe(200);
    expect(response.body.totalResults).toBe(50);
    expect(response.body.totalPages).toBe(3);
  });
  it("it should return 400 status code -> page parameter must be a number", async () => {
    const response = await request(app).get(
      "/publications/pagination?page=hola"
    );
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Page must be a number");
  });
  it("it should return 404 status code -> page not found", async () => {
    const response = await request(app).get("/publications/pagination?page=5");
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(`Page 5 not found!`);
  });
  it("it should return 200 status code -> get publication with pagination", async () => {
    const response = await request(app).get("/publications/pagination");
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(20);
  });
  it("it should return 200 status code -> get publication with pagination", async () => {
    const response = await request(app).get("/publications/pagination?page=1");
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(20);
  });
  it("it should return 200 status code -> get publication with pagination", async () => {
    const response = await request(app).get("/publications/pagination?page=3");
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(10);
  });
});
