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

let publication1_id,
  publication2_id,
  publication3_id,
  publication4_id,
  publication5_id;

describe("POST /publications route -> create new publication success", () => {
  it("it should return 201 status code -> new publication success", async () => {
    const publication = {
      title: "Publication 1",
      price: 100,
      amount: 100,
      description: "Description Publication 1",
      product: "Product 1",
    };

    const response = await request(app)
      .post("/publications")
      .send(publication)
      .set("Cookie", cookie);
    expect(response.status).toBe(201);
    expect(response.body.data.title).toBe("Publication 1");
    publication1_id = response.body.data.id;
  });
  it("it should return 201 status code -> new publication success", async () => {
    const publication = {
      title: "Publication 2",
      price: 500,
      amount: 1000,
      description: "Description Publication 2",
      product: "Product 2",
    };

    const response = await request(app)
      .post("/publications")
      .send(publication)
      .set("Cookie", cookie);
    expect(response.status).toBe(201);
    expect(response.body.data.title).toBe("Publication 2");
    publication2_id = response.body.data.id;
  });
  it("it should return a 200 status code -> logout process", async () => {
    const response = await request(app)
      .get("/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });
  it("it should return a 200 status code -> no admin user logged in", async () => {
    const user = {
      email: "user2@email.com",
      password: "Password14!",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
    cookie = response.headers["set-cookie"];
  });
  it("it should return 201 status code -> new publication success", async () => {
    const publication = {
      title: "Publication 3",
      price: 1500,
      amount: 700,
      description: "Description Publication 3",
      product: "Product 1",
    };

    const response = await request(app)
      .post("/publications")
      .send(publication)
      .set("Cookie", cookie);
    expect(response.status).toBe(201);
    expect(response.body.data.title).toBe("Publication 3");
    publication3_id = response.body.data.id;
  });
  it("it should return 201 status code -> new publication success", async () => {
    const publication = {
      title: "Publication 4",
      price: 2000,
      amount: 50,
      description: "Description Publication 4",
      product: "Product 1",
    };

    const response = await request(app)
      .post("/publications")
      .send(publication)
      .set("Cookie", cookie);
    expect(response.status).toBe(201);
    expect(response.body.data.title).toBe("Publication 4");
    publication4_id = response.body.data.id;
  });
  it("it should return 201 status code -> new publication success", async () => {
    const publication = {
      title: "Publication 5",
      price: 3000,
      amount: 120,
      description: "Description Publication 5",
      product: "Product 2",
    };

    const response = await request(app)
      .post("/publications")
      .send(publication)
      .set("Cookie", cookie);
    expect(response.status).toBe(201);
    expect(response.body.data.title).toBe("Publication 5");
    publication5_id = response.body.data.id;
  });
});

describe("GET /publications route -> get all publications", () => {
  it("it should return 200 status code -> get all publications", async () => {
    const response = await request(app).get("/publications");
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(5);
  });
  it("it should return 200 status code -> get all publications without user logged in id", async () => {
    const response = await request(app)
      .get("/publications")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(2);
  });
  it("it should return a 200 status code -> logout process", async () => {
    const response = await request(app)
      .get("/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });
});

describe("GET /publications/:id route -> get publication by id", () => {
  it("it should return 400 status code -> id invalid format", async () => {
    const response = await request(app).get("/publications/1");
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("ID invalid format!");
  });
  it("it should return 404 status code -> publication not found", async () => {
    const response = await request(app).get(
      "/publications/6b1c719b-741d-4661-8b23-79dc191d3165"
    );
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(
      "Publication with ID: 6b1c719b-741d-4661-8b23-79dc191d3165 not found!"
    );
  });
  it("it should return 200 status code -> get publication by id", async () => {
    const response = await request(app).get(`/publications/${publication1_id}`);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].title).toBe("Publication 1");
    expect(response.body.data[0].product).toBe("Product 1");
    expect(response.body.data[0].varietal).toBe("Varietal 1");
    expect(response.body.data[0].id).toBe(publication1_id);
    expect(response.body.data[0].username).toBe("User One");
    expect(response.body.data[0].email).toBe("user1@email.com");
  });
});

describe("GET /order/:opt route -> order features routes", () => {
  it("it should return 200 status code -> more opt", async () => {
    const response = await request(app).get("/publications/order/more");
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(5);
    expect(response.body.data[0].price).toBe(3000);
  });
  it("it should return 200 status code -> less opt", async () => {
    const response = await request(app).get("/publications/order/less");
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(5);
    expect(response.body.data[0].price).toBe(100);
  });
  it("it should return 200 status code -> less opt", async () => {
    const response = await request(app).get("/publications/order/az");
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(5);
    expect(response.body.data[0].title).toBe("Publication 1");
  });
  it("it should return 200 status code -> less opt", async () => {
    const response = await request(app).get("/publications/order/za");
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(5);
    expect(response.body.data[0].title).toBe("Publication 5");
  });
  it("it should return 400 status code -> filter not available", async () => {
    const response = await request(app).get("/publications/order/other");
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Filter not available!");
  });
});

describe("GET /order/:opt route -> order features routes with user logged in", () => {
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
  it("it should return 200 status code -> more opt", async () => {
    const response = await request(app)
      .get("/publications/order/more")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(3);
    expect(response.body.data[0].price).toBe(3000);
  });
  it("it should return 200 status code -> less opt", async () => {
    const response = await request(app)
      .get("/publications/order/less")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(3);
    expect(response.body.data[0].price).toBe(1500);
  });
  it("it should return 200 status code -> az opt", async () => {
    const response = await request(app)
      .get("/publications/order/az")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(3);
    expect(response.body.data[0].title).toBe("Publication 3");
  });
  it("it should return 200 status code -> za opt", async () => {
    const response = await request(app)
      .get("/publications/order/za")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(3);
    expect(response.body.data[0].title).toBe("Publication 5");
  });
  it("it should return a 200 status code -> logout process", async () => {
    const response = await request(app)
      .get("/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });
});

describe("GET /all route -> get all publications", () => {
  it("it should return 401 status code -> not authorized", async () => {
    const response = await request(app).get("/publications/all");
    expect(response.status).toBe(401);
    expect(response.body.msg).toBe("You are not authorized! Please login...");
  });
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
  it("it should return 200 status code -> get all publications", async () => {
    const response = await request(app)
      .get("/publications/all")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(5);
  });
});

describe("GET /banned route -> get banned publications", () => {
  it("it should return 404 status code -> no banned publications", async () => {
    const response = await request(app)
      .get("/publications/banned")
      .set("Cookie", cookie);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("No banned publications saved in DB!");
  });
  it("it should return a 200 status code -> logout process", async () => {
    const response = await request(app)
      .get("/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });
});

describe("PUT /:id/:banned route -> bar or not publications", () => {
  it("it should return 401 status code -> not authorized", async () => {
    const response = await request(app).get("/publications/all");
    expect(response.status).toBe(401);
    expect(response.body.msg).toBe("You are not authorized! Please login...");
  });
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
  it("it should return 400 status code -> id invalid format", async () => {
    const response = await request(app)
      .put("/publications/1?banned=true")
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("ID invalid format!");
  });
  it("it should return 400 status code -> banned parameter is missing", async () => {
    const response = await request(app)
      .put("/publications/45495fb5-e131-4683-afe7-37208301e73c")
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Banned parameter is missing");
  });
  it("it should return 400 status code -> banned must be true or false", async () => {
    const response = await request(app)
      .put("/publications/45495fb5-e131-4683-afe7-37208301e73c?banned=hola")
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Banned must be a true or false");
  });
  it("it should return 494 status code -> publication not found", async () => {
    const response = await request(app)
      .put("/publications/45495fb5-e131-4683-afe7-37208301e73c?banned=true")
      .set("Cookie", cookie);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(
      "Publication with ID: 45495fb5-e131-4683-afe7-37208301e73c not found!"
    );
  });
  it("it should return 200 status code -> publication updated success", async () => {
    const response = await request(app)
      .put(`/publications/${publication1_id}?banned=true`)
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body.data[0].title).toBe("Publication 1");
    expect(response.body.data[0].id).toBe(publication1_id);
  });
  it("it should return 200 status code -> get banned publications", async () => {
    const response = await request(app)
      .get("/publications/banned")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].id).toBe(publication1_id);
  });
  it("it should return 200 status code -> get not banned publications", async () => {
    const response = await request(app).get("/publications");
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(4);
  });
  it("it should return a 200 status code -> logout process", async () => {
    const response = await request(app)
      .get("/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });
});

describe("PUT /amount/:id route -> update publication amount", () => {
  it("it should return 401 status code -> not authorized", async () => {
    const response = await request(app).put("/publications/amount/1");
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
  it("it should return 400 status code -> id invalid format", async () => {
    const response = await request(app)
      .put("/publications/amount/1")
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("ID invalid format!");
  });
  it("it should return 400 status code -> amount parameter is missing", async () => {
    const response = await request(app)
      .put("/publications/amount/45495fb5-e131-4683-afe7-37208301e73c")
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Amount parameter is missing");
  });
  it("it should return 400 status code -> amount must be a number", async () => {
    const response = await request(app)
      .put(
        "/publications/amount/45495fb5-e131-4683-afe7-37208301e73c?amount=hola"
      )
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Amount must be a number");
  });
  it("it should return 400 status code -> amount must be 0 or higher", async () => {
    const response = await request(app)
      .put(
        "/publications/amount/45495fb5-e131-4683-afe7-37208301e73c?amount=-1"
      )
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Amount must be 0 or higher");
  });
  it("it should return 404 status code -> publication not found", async () => {
    const response = await request(app)
      .put(
        "/publications/amount/45495fb5-e131-4683-afe7-37208301e73c?amount=50"
      )
      .set("Cookie", cookie);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(
      "Publication with ID: 45495fb5-e131-4683-afe7-37208301e73c not found!"
    );
  });
  it("it should return 401 status code -> not authorized", async () => {
    const response = await request(app)
      .put(`/publications/amount/${publication3_id}?amount=50`)
      .set("Cookie", cookie);
    expect(response.status).toBe(401);
    expect(response.body.msg).toBe(
      "You are not authorized! You can only update your publications..."
    );
  });
});
