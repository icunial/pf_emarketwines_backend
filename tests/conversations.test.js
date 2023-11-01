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

/********* */

describe("GET /conversations route -> no conversations", () => {
  it("it should return 401 status code -> not authorized", async () => {
    const response = await request(app).get("/conversations");
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
  it("it should return 404 status code -> no conversations", async () => {
    const response = await request(app)
      .get("/conversations")
      .set("Cookie", cookie);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("You have no conversations!");
  });
});

let conversation1_id;

describe("POST /conversations/message route -> create new message", () => {
  it("it should return 401 status code -> not authorized", async () => {
    const message = {
      userId: 1,
      text: "Message 1",
    };

    const response = await request(app)
      .post("/conversations/message")
      .send(message);
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
  it("it should return 400 status code -> user id is missing", async () => {
    const message = {
      text: "Message 1",
    };

    const response = await request(app)
      .post("/conversations/message")
      .send(message)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("User ID is missing");
  });
  it("it should return 400 status code -> id invalid format", async () => {
    const message = {
      userId: 1,
      text: "Message 1",
    };

    const response = await request(app)
      .post("/conversations/message")
      .send(message)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("ID invalid format!");
  });
  it("it should return 404 status code -> user not found", async () => {
    const message = {
      userId: "a5503462-9dfb-4c8c-9a4a-c87a5f87f937",
      text: "Message 1",
    };

    const response = await request(app)
      .post("/conversations/message")
      .send(message)
      .set("Cookie", cookie);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(
      `User with ID: a5503462-9dfb-4c8c-9a4a-c87a5f87f937 not found!`
    );
  });
  it("it should return 400 status code -> message to yourself", async () => {
    const message = {
      userId: user1_id,
      text: "Message 1",
    };

    const response = await request(app)
      .post("/conversations/message")
      .send(message)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe(`You can not send a message to yourself!`);
  });
  it("it should return 400 status code -> text parameter is missing", async () => {
    const message = {
      userId: user2_id,
    };

    const response = await request(app)
      .post("/conversations/message")
      .send(message)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe(`Text parameter is missing`);
  });
  it("it should return 400 status code -> text must be a string", async () => {
    const message = {
      userId: user2_id,
      text: 1234,
    };

    const response = await request(app)
      .post("/conversations/message")
      .send(message)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe(`Text must be a string`);
  });
  it("it should return 201 status code -> message created success", async () => {
    const message = {
      userId: user2_id,
      text: "Message 1",
    };

    const response = await request(app)
      .post("/conversations/message")
      .send(message)
      .set("Cookie", cookie);
    expect(response.status).toBe(201);
    expect(response.body.data.userId).toBe(user1_id);
    expect(response.body.data.text).toBe("Message 1");
    conversation1_id = response.body.data.conversationId;
  });
  it("it should return 201 status code -> message created success", async () => {
    const message = {
      userId: user2_id,
      text: "Message 2",
    };

    const response = await request(app)
      .post("/conversations/message")
      .send(message)
      .set("Cookie", cookie);
    expect(response.status).toBe(201);
    expect(response.body.data.userId).toBe(user1_id);
    expect(response.body.data.text).toBe("Message 2");
  });
  it("it should return a 200 status code -> logout process", async () => {
    const response = await request(app)
      .get("/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });
});

describe("GET /conversations route -> get user conversations", () => {
  it("it should return 401 status code -> not authorized", async () => {
    const response = await request(app).get("/conversations");
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
  it("it should return 200 status code -> get user conversations", async () => {
    const response = await request(app)
      .get("/conversations")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].username).toBe("User Two");
    expect(response.body.data[0].id).toBe(conversation1_id);
  });
  it("it should return a 200 status code -> logout process", async () => {
    const response = await request(app)
      .get("/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });
});

describe("GET /conversations/:id route -> get conversation by id", () => {
  it("it should return 401 status code -> not authorized", async () => {
    const response = await request(app).get("/conversations/1");
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
});
