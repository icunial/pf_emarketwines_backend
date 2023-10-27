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
  publication5_id,
  publication6_id;

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
  it("it should return 201 status code -> new publication success", async () => {
    const publication = {
      title: "Publication 6",
      price: 500,
      amount: 1000,
      description: "Description Publication 6",
      product: "Product 2",
    };

    const response = await request(app)
      .post("/publications")
      .send(publication)
      .set("Cookie", cookie);
    expect(response.status).toBe(201);
    expect(response.body.data.title).toBe("Publication 6");
    publication6_id = response.body.data.id;
  });
  it("it should return 200 status code -> updated publication success", async () => {
    const response = await request(app)
      .put(`/publications/amount/${publication2_id}?amount=0`)
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].amount).toBe(0);
  });
  it("it should return a 200 status code -> logout process", async () => {
    const response = await request(app)
      .get("/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
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
  it("it should return 200 status code -> publication updated success", async () => {
    const response = await request(app)
      .put(`/publications/${publication1_id}?banned=true`)
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body.data[0].title).toBe("Publication 1");
    expect(response.body.data[0].id).toBe(publication1_id);
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

/********************************** */

describe("POST /buys route -> create new buy validations", () => {
  it("it should return 401 status code -> not authorized", async () => {
    const buy = {
      currency: "ARG",
      paymentMethod: "CARD",
    };

    const response = await request(app).post("/buys").send(buy);
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
  it("it should return 400 status code -> currency parameter is missing", async () => {
    const buy = {
      paymentMethod: "CARD",
      publicationId: 1,
    };

    const response = await request(app)
      .post("/buys")
      .send(buy)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Currency parameter is missing");
  });
  it("it should return 400 status code -> currency must be a string", async () => {
    const buy = {
      currency: 1234,
      paymentMethod: "CARD",
      publicationId: 1,
    };

    const response = await request(app)
      .post("/buys")
      .send(buy)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Currency must be a string");
  });
  it("it should return 400 status code -> currency not available", async () => {
    const buy = {
      currency: "EUR",
      paymentMethod: "CARD",
      publicationId: 1,
    };

    const response = await request(app)
      .post("/buys")
      .send(buy)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Currency not available");
  });
  it("it should return 400 status code -> payment method is missing", async () => {
    const buy = {
      currency: "ARG",
      publicationId: 1,
    };

    const response = await request(app)
      .post("/buys")
      .send(buy)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Payment Method parameter is missing");
  });
  it("it should return 400 status code -> payment method must be a string", async () => {
    const buy = {
      currency: "ARG",
      paymentMethod: 1234,
      publicationId: 1,
    };

    const response = await request(app)
      .post("/buys")
      .send(buy)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Payment Method must be a string");
  });
  it("it should return 400 status code -> payment method not available", async () => {
    const buy = {
      currency: "ARG",
      paymentMethod: "DEB",
      publicationId: 1,
    };

    const response = await request(app)
      .post("/buys")
      .send(buy)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Payment Method not available");
  });
  it("it should return 400 status code -> publication id parameter is missing", async () => {
    const buy = {
      currency: "ARG",
      paymentMethod: "CASH",
    };

    const response = await request(app)
      .post("/buys")
      .send(buy)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Publication ID parameter is missing");
  });
  it("it should return 400 status code -> id invalid format", async () => {
    const buy = {
      currency: "ARG",
      paymentMethod: "CASH",
      publicationId: 1,
    };

    const response = await request(app)
      .post("/buys")
      .send(buy)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("ID invalid format!");
  });
  it("it should return 404 status code -> publication not found", async () => {
    const buy = {
      currency: "ARG",
      paymentMethod: "CASH",
      publicationId: "8022e314-e56a-4eff-8c10-fae4a0eadc40",
    };

    const response = await request(app)
      .post("/buys")
      .send(buy)
      .set("Cookie", cookie);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(
      "Publication with ID: 8022e314-e56a-4eff-8c10-fae4a0eadc40 not found!"
    );
  });
  it("it should return 404 status code -> publication not found", async () => {
    const buy = {
      currency: "ARG",
      paymentMethod: "CASH",
      publicationId: "8022e314-e56a-4eff-8c10-fae4a0eadc40",
    };

    const response = await request(app)
      .post("/buys")
      .send(buy)
      .set("Cookie", cookie);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(
      "Publication with ID: 8022e314-e56a-4eff-8c10-fae4a0eadc40 not found!"
    );
  });
  it("it should return 400 status code -> publication is banned", async () => {
    const buy = {
      currency: "ARG",
      paymentMethod: "CASH",
      publicationId: publication1_id,
    };

    const response = await request(app)
      .post("/buys")
      .send(buy)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("You can not buy a banned publication!");
  });
  it("it should return 400 status code -> publication is banned", async () => {
    const buy = {
      currency: "ARG",
      paymentMethod: "CASH",
      publicationId: publication2_id,
    };

    const response = await request(app)
      .post("/buys")
      .send(buy)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Publication does not have stock!");
  });
  it("it should return 400 status code -> publication is yours", async () => {
    const buy = {
      currency: "ARG",
      paymentMethod: "CASH",
      publicationId: publication6_id,
    };

    const response = await request(app)
      .post("/buys")
      .send(buy)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("You can not buy your own publication!");
  });
});

describe("GET /buys route -> no buys saved in db", () => {
  it("it should return 200 status code -> logout process", async () => {
    const response = await request(app)
      .get("/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });
  it("it should return 200 status code -> admin user logged in", async () => {
    const user = {
      email: "admin@ewines.com",
      password: "Password14!",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
    cookie = response.headers["set-cookie"];
  });
  it("it should return 404 status code -> no buys saved in db", async () => {
    const response = await request(app).get("/buys").set("Cookie", cookie);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("No Buys saved in DB!");
  });
  it("it should return 200 status code -> logout process", async () => {
    const response = await request(app)
      .get("/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });
});

let buy1_id;

describe("POST /buys route -> new buy created success", () => {
  it("it should return 200 status code -> no admin user logged in", async () => {
    const user = {
      email: "user1@email.com",
      password: "Password14!",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
    cookie = response.headers["set-cookie"];
  });
  it("it should return 201 status code -> new buy created success", async () => {
    const buy = {
      currency: "ARG",
      paymentMethod: "CASH",
      publicationId: publication3_id,
    };

    const response = await request(app)
      .post("/buys")
      .send(buy)
      .set("Cookie", cookie);
    expect(response.status).toBe(201);
    expect(response.body.data.publicationId).toBe(publication3_id);
    expect(response.body.data.userId).toBe(user1_id);
    buy1_id = response.body.data.id;
  });
  it("it should return 200 status code -> logout process", async () => {
    const response = await request(app)
      .get("/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });
});

describe("GET /buys route -> get all buys", () => {
  it("it should return 401 status code -> not authorized", async () => {
    const response = await request(app).get("/buys");
    expect(response.status).toBe(401);
    expect(response.body.msg).toBe("You are not authorized! Please login...");
  });
  it("it should return 200 status code -> no admin user logged in", async () => {
    const user = {
      email: "user1@email.com",
      password: "Password14!",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
    cookie = response.headers["set-cookie"];
  });
  it("it should return 401 status code -> no admin privileges", async () => {
    const response = await request(app).get("/buys").set("Cookie", cookie);
    expect(response.status).toBe(401);
    expect(response.body.msg).toBe(
      "You are not authorized! You must have admin privileges..."
    );
  });
  it("it should return 200 status code -> logout process", async () => {
    const response = await request(app)
      .get("/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });
  it("it should return 200 status code -> admin user logged in", async () => {
    const user = {
      email: "admin@ewines.com",
      password: "Password14!",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
    cookie = response.headers["set-cookie"];
  });
  it("it should return 200 status code -> get all buys", async () => {
    const response = await request(app).get("/buys").set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].publication).toBe("Publication 3");
    expect(response.body.data[0].username).toBe("User One");
  });
  it("it should return 200 status code -> logout process", async () => {
    const response = await request(app)
      .get("/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });
});

describe("GET /buys/:id route -> get buy by id", () => {
  it("it should return 401 status code -> not authorized", async () => {
    const response = await request(app).get("/buys/1");
    expect(response.status).toBe(401);
    expect(response.body.msg).toBe("You are not authorized! Please login...");
  });
  it("it should return 200 status code -> no admin user logged in", async () => {
    const user = {
      email: "user2@email.com",
      password: "Password14!",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
    cookie = response.headers["set-cookie"];
  });
  it("it should return 400 status code -> id invalid format", async () => {
    const response = await request(app).get("/buys/1").set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("ID invalid format!");
  });
  it("it should return 404 status code -> buy not found", async () => {
    const response = await request(app)
      .get("/buys/8022e314-e56a-4eff-8c10-fae4a0eadc40")
      .set("Cookie", cookie);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(
      "Buy with ID: 8022e314-e56a-4eff-8c10-fae4a0eadc40 not found!"
    );
  });
  it("it should return 401 status code -> buy not yours", async () => {
    const response = await request(app)
      .get(`/buys/${buy1_id}`)
      .set("Cookie", cookie);
    expect(response.status).toBe(401);
    expect(response.body.msg).toBe(
      "You are not authorized! You can not access to a buy that is not yours..."
    );
  });
  it("it should return 200 status code -> logout process", async () => {
    const response = await request(app)
      .get("/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });
  it("it should return 200 status code -> no admin user logged in", async () => {
    const user = {
      email: "user1@email.com",
      password: "Password14!",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
    cookie = response.headers["set-cookie"];
  });
  it("it should return 200 status code -> get buy by id", async () => {
    const response = await request(app)
      .get(`/buys/${buy1_id}`)
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].id).toBe(buy1_id);
    expect(response.body.data[0].username).toBe("User One");
  });
  it("it should return 200 status code -> logout process", async () => {
    const response = await request(app)
      .get("/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });
  it("it should return 200 status code -> admin user logged in", async () => {
    const user = {
      email: "admin@ewines.com",
      password: "Password14!",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
    cookie = response.headers["set-cookie"];
  });
  it("it should return 200 status code -> get buy by id", async () => {
    const response = await request(app)
      .get(`/buys/${buy1_id}`)
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].id).toBe(buy1_id);
    expect(response.body.data[0].username).toBe("User One");
  });
  it("it should return 200 status code -> logout process", async () => {
    const response = await request(app)
      .get("/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });
});

describe("GET /buys/own -> get user buys", () => {
  it("it should return 401 status code -> not authorized", async () => {
    const response = await request(app).get("/buys/own");
    expect(response.status).toBe(401);
    expect(response.body.msg).toBe("You are not authorized! Please login...");
  });
  it("it should return 200 status code -> no admin user logged in", async () => {
    const user = {
      email: "user2@email.com",
      password: "Password14!",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
    cookie = response.headers["set-cookie"];
  });
  it("it should return 404 status code -> no buys", async () => {
    const response = await request(app).get("/buys/own").set("Cookie", cookie);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("You have no buys!");
  });
});
