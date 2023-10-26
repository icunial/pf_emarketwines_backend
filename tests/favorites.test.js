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

let publication1_id,
  publication2_id,
  publication3_id,
  publication4_id,
  publication5_id;

describe("POST /publications route -> create new publication success", () => {
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
  it("it should return a 200 status code -> logout process", async () => {
    const response = await request(app)
      .get("/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });
});

/******************************************************** */

describe("POST /:id route -> post a favorite", () => {
  it("it should return a 401 status code -> not authorized", async () => {
    const response = await request(app).post(
      "/favorites/45495fb5-e131-4683-afe7-37208301e73c"
    );
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
  it("it should return a 400 status code -> id invalid format", async () => {
    const response = await request(app)
      .post("/favorites/1")
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("ID invalid format!");
  });
  it("it should return a 400 status code -> publication not found", async () => {
    const response = await request(app)
      .post("/favorites/45495fb5-e131-4683-afe7-37208301e73c")
      .set("Cookie", cookie);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(
      "Publication with ID: 45495fb5-e131-4683-afe7-37208301e73c not found!"
    );
  });
  it("it should return a 201 status code -> favorite created success", async () => {
    const response = await request(app)
      .post(`/favorites/${publication1_id}`)
      .set("Cookie", cookie);
    expect(response.status).toBe(201);
    expect(response.body.msg).toBe(
      `You favorited publication: ${publication1_id}!`
    );
  });
  it("it should return a 400 status code -> can not favorite twice", async () => {
    const response = await request(app)
      .post(`/favorites/${publication1_id}`)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("You cannot favorite a publication twice!");
  });
});

describe("GET /:id route -> get all favorites of a publication", () => {
  it("it should return a 404 status code -> publication not found", async () => {
    const response = await request(app).get(
      "/favorites/45495fb5-e131-4683-afe7-37208301e73c"
    );

    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(
      "Publication with ID: 45495fb5-e131-4683-afe7-37208301e73c not found!"
    );
  });
  it("it should return a 200 status code -> get all favorites", async () => {
    const response = await request(app).get(`/favorites/${publication2_id}`);
    expect(response.status).toBe(200);
    expect(response.body.favorites).toBe(0);
  });
  it("it should return a 200 status code -> get all favorites", async () => {
    const response = await request(app).get(`/favorites/${publication1_id}`);
    expect(response.status).toBe(200);
    expect(response.body.favorites).toBe(1);
  });
});

describe("DELETE /favorites/:id route -> delete a favorite", () => {
  it("it should return a 404 status code -> publication not found", async () => {
    const response = await request(app)
      .delete("/favorites/45495fb5-e131-4683-afe7-37208301e73c")
      .set("Cookie", cookie);

    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(
      "Publication with ID: 45495fb5-e131-4683-afe7-37208301e73c not found!"
    );
  });
  it("it should return a 400 status code -> can not delete a favorite", async () => {
    const response = await request(app)
      .delete(`/favorites/${publication2_id}`)
      .set("Cookie", cookie);

    expect(response.status).toBe(400);
    expect(response.body.msg).toBe(
      "You can not delete a favorite of a publication you did not favorite!"
    );
  });
  it("it should return a 200 status code -> delete favorite success", async () => {
    const response = await request(app)
      .delete(`/favorites/${publication1_id}`)
      .set("Cookie", cookie);

    expect(response.status).toBe(200);
    expect(response.body.msg).toBe(
      `You removed your favorite of publication ${publication1_id}`
    );
  });
  it("it should return a 200 status code -> get all favorites", async () => {
    const response = await request(app).get(`/favorites/${publication1_id}`);
    expect(response.status).toBe(200);
    expect(response.body.favorites).toBe(0);
  });
  it("it should return a 200 status code -> logout process", async () => {
    const response = await request(app)
      .get("/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });
});
