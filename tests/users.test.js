const request = require("supertest");
const app = require("../index");
const db = require("../src/db");
const User = require("../src/models/User");

beforeAll(async () => {
  await db.sync({ force: true });
});

afterAll((done) => {
  db.close();
  done();
});

describe("Users table is Empty", () => {
  it("it should return 404 status code -> no users saved in database", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("No users saved in DB!");
  });
});

describe("POST /register route -> parameters validations", () => {
  it("it should return a 400 status code -> password parameter is missing", async () => {
    const user = {
      email: "user1@email.com",
      username: "User 1",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Password parameter is missing");
  });
  it("it should return a 400 status code -> password must be a string", async () => {
    const user = {
      password: 123,
      email: "user1@email.com",
      username: "User 1",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Password must be a string");
  });
  it("it should return a 400 status code -> password must be at least 8 characters long", async () => {
    const user = {
      password: "1234",
      email: "user1@email.com",
      username: "User 1",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe(
      "Password must be at least 8 character long"
    );
  });
  it("it should return a 400 status code -> password must have one capital letter", async () => {
    const user = {
      password: "password",
      email: "user1@email.com",
      username: "User 1",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Password must have one capital letter");
  });
  it("it should return a 400 status code -> password must have one number", async () => {
    const user = {
      password: "Password",
      email: "user1@email.com",
      username: "User 1",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Password must have one number");
  });
  it("it should return a 400 status code -> password must have one symbol", async () => {
    const user = {
      password: "Password14",
      email: "user1@email.com",
      username: "User 1",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Password must have one symbol");
  });
  it("it should return a 400 status code -> email parameter is missing", async () => {
    const user = {
      password: "Password14!",
      username: "User 1",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Email parameter is missing");
  });
  it("it should return a 400 status code -> email must be a string", async () => {
    const user = {
      email: 1234,
      password: "Password14!",
      username: "User 1",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Email must be a string");
  });
  it("it should return a 400 status code -> email does not have a @", async () => {
    const user = {
      email: "user1email.com",
      password: "Password14!",
      username: "User 1",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Email format is not valid!");
  });
  it("it should return a 400 status code -> email format is not valid", async () => {
    const user = {
      email: "user1@emailcom",
      password: "Password14!",
      username: "User 1",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Email format is not valid!");
  });
  it("it should return a 400 status code -> email second part has a symbol", async () => {
    const user = {
      email: "user1@email.#com",
      password: "Password14!",
      username: "User 1",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Email format not valid");
  });
  it("it should return a 400 status code -> email second part has a number", async () => {
    const user = {
      email: "user1@email.1com",
      password: "Password14!",
      username: "User 1",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Email format not valid");
  });
  it("it should return a 400 status code -> username parameter is missing", async () => {
    const user = {
      email: "user1@email.com",
      password: "Password14!",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Username parameter is missing");
  });
  it("it should return a 400 status code -> username must be a string", async () => {
    const user = {
      email: "user1@email.com",
      username: 1234,
      password: "Password14!",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Username must be a string");
  });
  it("it should return a 400 status code -> region parameter is missing", async () => {
    const user = {
      email: "user1@email.com",
      username: "User One",
      password: "Password14!",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Region parameter is missing");
  });
  it("it should return a 400 status code -> region must be a string", async () => {
    const user = {
      email: "user1@email.com",
      username: "User One",
      password: "Password14!",
      region: 1234,
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Region must be a string");
  });
  it("it should return a 400 status code -> phone must be a string", async () => {
    const user = {
      email: "user1@email.com",
      username: "User One",
      password: "Password14!",
      region: "Region One",
      phone: 12345678,
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Phone must be a string");
  });
  it("it should return a 400 status code -> phone must contain only numbers", async () => {
    const user = {
      email: "user1@email.com",
      username: "User One",
      password: "Password14!",
      region: "Region One",
      phone: "12345678!",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Phone must contain only numbers");
  });
  it("it should return a 400 status code -> password confirmation parameter is missing", async () => {
    const user = {
      email: "user1@email.com",
      username: "User One",
      password: "Password14!",
      region: "Region One",
      phone: "12345678",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe(
      "Password Confirmation parameter is missing"
    );
  });
  it("it should return a 400 status code -> password confirmation must be a string", async () => {
    const user = {
      email: "user1@email.com",
      username: "User One",
      password: "Password14!",
      region: "Region One",
      phone: "12345678",
      password2: 1234,
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Password Confirmation must be a string");
  });
  it("it should return a 400 status code -> password confirmation must be 8 character long", async () => {
    const user = {
      email: "user1@email.com",
      username: "User One",
      password: "Password14!",
      region: "Region One",
      phone: "12345678",
      password2: "1234",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe(
      "Password Confirmation must be at least 8 character long"
    );
  });
  it("it should return a 400 status code -> password confirmation must have one capital letter", async () => {
    const user = {
      email: "user1@email.com",
      username: "User One",
      password: "Password14!",
      region: "Region One",
      phone: "12345678",
      password2: "password",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe(
      "Password Confirmation must have one capital letter"
    );
  });
  it("it should return a 400 status code -> password confirmation must have one number", async () => {
    const user = {
      email: "user1@email.com",
      username: "User One",
      password: "Password14!",
      region: "Region One",
      phone: "12345678",
      password2: "Password",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe(
      "Password Confirmation must have one number"
    );
  });
  it("it should return a 400 status code -> password confirmation must have one symbol", async () => {
    const user = {
      email: "user1@email.com",
      username: "User One",
      password: "Password14!",
      region: "Region One",
      phone: "12345678",
      password2: "Password14",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe(
      "Password Confirmation must have one symbol"
    );
  });
  it("it should return a 400 status code -> password and password confirmation not match", async () => {
    const user = {
      email: "user1@email.com",
      username: "User One",
      password: "Password14!",
      region: "Region One",
      phone: "12345678",
      password2: "Password14@",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe(
      "Password and Password Confirmation not match"
    );
  });
});

let user1_id;

describe("POST /register route -> create new user", () => {
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

describe("GET / route -> get all users from database", () => {
  it("it should return 200 status code", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
  });
});

describe("GET /:id route -> get user by id", () => {
  it("it should return 400 status code -> id invalid format", async () => {
    const response = await request(app).get("/users/1");
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("ID 1 - Invalid format!");
  });
  it("it should return 404 status code -> user not found", async () => {
    const response = await request(app).get(
      "/users/eaac964e-05e1-4951-9894-4b630f75f586"
    );
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(
      "User with ID: eaac964e-05e1-4951-9894-4b630f75f586 not found!"
    );
  });
  it("it should return 200 status code -> user found", async () => {
    const response = await request(app).get(`/users/${user1_id}`);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].id).toBe(user1_id);
  });
});

describe("POST /register route -> check if email and username exist", () => {
  it("it should return a 400 status code -> email exists", async () => {
    const user = {
      email: "user1@email.com",
      username: "User Two",
      password: "Password14!",
      region: "Region Two",
      phone: "12345678",
      password2: "Password14!",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe(
      "Email user1@email.com exists! Try with another one!"
    );
  });
  it("it should return a 400 status code -> username exists", async () => {
    const user = {
      email: "user2@email.com",
      username: "User One",
      password: "Password14!",
      region: "Region Two",
      phone: "12345678",
      password2: "Password14!",
    };

    const response = await request(app).post("/users/register").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe(
      "Username User One exists! Try with another one!"
    );
  });
});

describe("PUT /:id route -> update user", () => {
  it("it should return a 400 status code -> query parameter is missing", async () => {
    const response = await request(app).put(`/users/${user1_id}`);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Query parameter is missing!");
  });
  it("it should return a 400 status code -> banned query value must be true or false", async () => {
    const response = await request(app).put(`/users/${user1_id}?banned=hola`);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Banned query value must be true or false");
  });
  it("it should return a 400 status code -> sommelier query value must be true or false", async () => {
    const response = await request(app).put(
      `/users/${user1_id}?sommelier=hola`
    );
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe(
      "Sommelier query value must be true or false"
    );
  });
  it("it should return a 400 status code -> admin query value must be true or false", async () => {
    const response = await request(app).put(`/users/${user1_id}?admin=hola`);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Admin query value must be true or false");
  });
  it("it should return a 400 status code -> verified query value must be true or false", async () => {
    const response = await request(app).put(`/users/${user1_id}?verified=hola`);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe(
      "Verified query value must be true or false"
    );
  });
  it("it should return a 400 status code -> id invalid format", async () => {
    const response = await request(app).put(`/users/1?verified=true`);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("ID invalid format!");
  });
  it("it should return a 404 status code -> user id not found", async () => {
    const response = await request(app).put(
      `/users/d3461839-61a4-4288-bb3b-0f9f8c84c37d?verified=true`
    );
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(
      "User with ID: d3461839-61a4-4288-bb3b-0f9f8c84c37d not found!"
    );
  });
  it("it should return a 200 status code -> user updated", async () => {
    const response = await request(app).put(`/users/${user1_id}?verified=true`);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].isVerified).toBe(true);
  });
});

let cookie;

describe("POST /login route -> login process", () => {
  it("it should return a 400 status code -> password parameter is missing", async () => {
    const user = {
      email: "user1@email.com",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Password parameter is missing");
  });
  it("it should return a 400 status code -> password must be a string", async () => {
    const user = {
      password: 123,
      email: "user1@email.com",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Password must be a string");
  });
  it("it should return a 400 status code -> password must be at least 8 characters long", async () => {
    const user = {
      password: "1234",
      email: "user1@email.com",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe(
      "Password must be at least 8 character long"
    );
  });
  it("it should return a 400 status code -> password must have one capital letter", async () => {
    const user = {
      password: "password",
      email: "user1@email.com",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Password must have one capital letter");
  });
  it("it should return a 400 status code -> password must have one number", async () => {
    const user = {
      password: "Password",
      email: "user1@email.com",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Password must have one number");
  });
  it("it should return a 400 status code -> password must have one symbol", async () => {
    const user = {
      password: "Password14",
      email: "user1@email.com",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Password must have one symbol");
  });
  it("it should return a 400 status code -> email parameter is missing", async () => {
    const user = {
      password: "Password14!",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Email parameter is missing");
  });
  it("it should return a 400 status code -> email must be a string", async () => {
    const user = {
      email: 1234,
      password: "Password14!",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Email must be a string");
  });
  it("it should return a 400 status code -> email does not have a @", async () => {
    const user = {
      email: "user1email.com",
      password: "Password14!",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Email format is not valid!");
  });
  it("it should return a 400 status code -> email format is not valid", async () => {
    const user = {
      email: "user1@emailcom",
      password: "Password14!",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Email format is not valid!");
  });
  it("it should return a 400 status code -> email second part has a symbol", async () => {
    const user = {
      email: "user1@email.#com",
      password: "Password14!",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Email format not valid");
  });
  it("it should return a 400 status code -> email second part has a number", async () => {
    const user = {
      email: "user1@email.1com",
      password: "Password14!",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Email format not valid");
  });
  it("it should return a 404 status code -> email not found", async () => {
    const user = {
      email: "user2@email.com",
      password: "Password14!",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("Email address not found!");
  });
  it("it should return a 400 status code -> incorrect password", async () => {
    const user = {
      email: "user1@email.com",
      password: "Password14@",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Incorrect password!");
  });
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
  it("it should return a 400 status code -> a user is already logged in", async () => {
    const user = {
      email: "user1@email.com",
      password: "Password14!",
    };

    const response = await request(app)
      .post("/users/login")
      .send(user)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("A user is already logged in");
  });
  it("it should return a 200 status code -> get logged in user", async () => {
    const response = await request(app)
      .get("/users/user")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe("user1@email.com");
  });
  it("it should return a 200 status code -> logout process", async () => {
    const response = await request(app)
      .get("/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });
});

describe("PUT /forgot route -> reset password", () => {
  it("it should return 400 status code -> email parameter is missing", async () => {
    const user = {};

    const response = await request(app).put("/users/forgot").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Email parameter is missing");
  });
  it("it should return 400 status code -> email must be a string", async () => {
    const user = {
      email: 1234,
    };

    const response = await request(app).put("/users/forgot").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Email must be a string");
  });
  it("it should return a 400 status code -> email does not have a @", async () => {
    const user = {
      email: "user1email.com",
    };

    const response = await request(app).put("/users/forgot").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Email format is not valid!");
  });
  it("it should return a 400 status code -> email format is not valid", async () => {
    const user = {
      email: "user1@emailcom",
    };

    const response = await request(app).put("/users/forgot").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Email format is not valid!");
  });
  it("it should return a 400 status code -> email second part has a symbol", async () => {
    const user = {
      email: "user1@email.#com",
    };

    const response = await request(app).put("/users/forgot").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Email format not valid");
  });
  it("it should return a 400 status code -> email second part has a number", async () => {
    const user = {
      email: "user1@email.1com",
    };

    const response = await request(app).put("/users/forgot").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Email format not valid");
  });
  it("it should return a 404 status code -> email not found", async () => {
    const user = {
      email: "user2@email.com",
    };

    const response = await request(app).put("/users/forgot").send(user);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("Email user2@email.com not found!");
  });
  it("it should return a 200 status code -> new password sent", async () => {
    const user = {
      email: "user1@email.com",
    };

    const response = await request(app).put("/users/forgot").send(user);
    expect(response.status).toBe(200);
    expect(response.body.msg).toBe(
      "New Password was sent to your email address!"
    );
  });
});

describe("PUT /password route -> not authorized", () => {
  it("it should return 401 status code -> not authorized", async () => {
    const user = {
      password: "Password14!",
      password2: "Password14!",
    };

    const response = await request(app).put("/users/password").send(user);
    expect(response.status).toBe(401);
    expect(response.body.msg).toBe("You are not authorized! Please login...");
  });
});

describe("POST /login route -> login with reseted password", () => {
  it("it should return a 400 status code -> incorrect password / with previous password", async () => {
    const user = {
      email: "user1@email.com",
      password: "Password14!",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Incorrect password!");
  });
  it("it should return 200 status code -> login process success", async () => {
    const user = {
      email: "user1@email.com",
      password: "E-Wine2023",
    };

    const response = await request(app).post("/users/login").send(user);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
    cookie = response.headers["set-cookie"];
  });
});

describe("PUT /password route -> update password", () => {
  it("it should return 400 status code -> email parameter is missing", async () => {
    const user = {
      password: "Password14!",
      password2: "Password14!",
    };

    const response = await request(app)
      .put("/users/password")
      .send(user)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Email parameter is missing");
  });
  it("it should return 400 status code -> email must be a string", async () => {
    const user = {
      email: 1234,
      password: "Password14!",
      password2: "Password14!",
    };

    const response = await request(app)
      .put("/users/password")
      .send(user)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Email must be a string");
  });
  it("it should return 400 status code -> password parameter is missing", async () => {
    const user = {
      email: "user1@email.com",
      password2: "Password14!",
      newPassword,
    };

    const response = await request(app).put("/users/password").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Password parameter is missing");
  });
  it("it should return 400 status code -> password must be a string", async () => {
    const user = {
      email: "user1@email.com",
      password: 1234,
      password2: "Password14!",
      newPassword,
    };

    const response = await request(app).put("/users/password").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Password must be a string");
  });
  it("it should return 400 status code -> password confirmation parameter is missing", async () => {
    const user = {
      email: "user1@email.com",
      password: "Password14!",
      newPassword,
    };

    const response = await request(app).put("/users/password").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe(
      "Password Confirmation parameter is missing"
    );
  });
  it("it should return 400 status code -> password confirmation parameter must be a string", async () => {
    const user = {
      email: "user1@email.com",
      password: "Password14!",
      password2: 1234,
      newPassword,
    };

    const response = await request(app).put("/users/password").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Password Confirmation must be a string");
  });
  it("it should return 400 status code -> passwords not match", async () => {
    const user = {
      email: "user1@email.com",
      password: "Password14!",
      password2: "Password14@",
      newPassword,
    };

    const response = await request(app).put("/users/password").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe(
      "Password and Password Confirmation not match"
    );
  });
  it("it should return 404 status code -> email not found", async () => {
    const user = {
      email: "user2@email.com",
      password: "Password14!",
      password2: "Password14!",
      newPassword,
    };

    const response = await request(app).put("/users/password").send(user);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("Email user2@email.com not found!");
  });
  it("it should return 400 status code -> password incorrect", async () => {
    const user = {
      email: "user1@email.com",
      password: "Password14!",
      password2: "Password14!",
      newPassword: "password",
    };

    const response = await request(app).put("/users/password").send(user);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Password incorrect!");
  });
  it("it should return 200 status code -> password updated success", async () => {
    const user = {
      email: "user1@email.com",
      password: "Password14!",
      password2: "Password14!",
      newPassword,
    };
    const response = await request(app).put("/users/password").send(user);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].email).toBe("user1@email.com");
  });
});
