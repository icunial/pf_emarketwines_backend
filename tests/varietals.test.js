const request = require("supertest");
const app = require("../index");
const db = require("../src/db");

beforeAll(async () => {
  await db.sync({ force: true });
});

afterAll((done) => {
  db.close();
  done();
});

let user1_id, admin_id;

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

let cookie;

describe("GET /varietals route -> no varietals saved in DB", () => {
  it("it should return 404 status code -> no varietals saved in DB", async () => {
    const response = await request(app).get("/varietals");
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("No varietals saved in DB!");
  });
});

describe("POST /varietals route -> Create new varietal validations", () => {
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
  it("it should return 400 status code -> name parameter is missing", async () => {
    const varietal = {
      description: "Description Varietal 1",
    };

    const response = await request(app)
      .post("/varietals")
      .send(varietal)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Name parameter is missing");
  });
  it("it should return 400 status code -> name must be a string", async () => {
    const varietal = {
      name: 1234,
      description: "Description Varietal 1",
    };

    const response = await request(app)
      .post("/varietals")
      .send(varietal)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Name must be a string");
  });
  it("it should return 400 status code -> description parameter is missing", async () => {
    const varietal = {
      name: "Varietal 1",
    };

    const response = await request(app)
      .post("/varietals")
      .send(varietal)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Description parameter is missing");
  });
  it("it should return 400 status code -> description must be a string", async () => {
    const varietal = {
      name: "Varietal 1",
      description: 1234,
    };

    const response = await request(app)
      .post("/varietals")
      .send(varietal)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Description must be a string");
  });
  it("it should return a 200 status code -> logout process", async () => {
    const response = await request(app)
      .get("/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });
});

let varietal1_id, varietal2_id, varietal3_id;

describe("POST /varietals route -> Create new varietal success", () => {
  it("it should return 401 status code -> not authorized", async () => {
    const varietal = {
      name: "Varietal 1",
      description: "Description Varietal 1",
    };
    const response = await request(app).post("/varietals").send(varietal);
    expect(response.status).toBe(401);
    expect(response.body.msg).toBe("You are not authorized! Please login...");
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
  it("it should return 401 status code -> no admin privileges", async () => {
    const varietal = {
      name: "Varietal 1",
      description: "Description Varietal 1",
    };
    const response = await request(app)
      .post("/varietals")
      .send(varietal)
      .set("Cookie", cookie);
    expect(response.status).toBe(401);
    expect(response.body.msg).toBe(
      "You are not authorized! You must have admin privileges..."
    );
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
});

describe("POST /varietals route -> Create new varietal success", () => {
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

describe("POST /varietals route -> Create new varietal success", () => {
  it("it should return 201 status code -> new varietal created", async () => {
    const varietal = {
      name: "Varietal 3",
      description: "Description Varietal 3",
    };
    const response = await request(app)
      .post("/varietals")
      .send(varietal)
      .set("Cookie", cookie);
    varietal3_id = response.body.data.id;
    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe("Varietal 3");
    expect(response.body.data.description).toBe("Description Varietal 3");
  });
});

describe("GET /varietals route -> get all varietals", () => {
  it("it should return 200 status code -> get all varietals", async () => {
    const response = await request(app).get("/varietals");
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(3);
    expect(response.body.data[0].id).toBe(varietal1_id);
  });
});

describe("GET /varietals/:id route -> get varietal by id", () => {
  it("it should return 400 status code -> id invalid format", async () => {
    const response = await request(app).get("/varietals/1");
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("ID invalid format!");
  });
  it("it should return 404 status code -> varietal not found", async () => {
    const response = await request(app).get(
      "/varietals/2c79ae06-c7d1-40f9-a647-2b7f9508b5ab"
    );
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(
      `Varietal with ID: 2c79ae06-c7d1-40f9-a647-2b7f9508b5ab not found!`
    );
  });
  it("it should return 200 status code -> varietal found", async () => {
    const response = await request(app).get(`/varietals/${varietal1_id}`);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].name).toBe("Varietal 1");
  });
});

describe("POST /varietals route -> varietal already exists", () => {
  it("it should return 400 status code -> varietal exists", async () => {
    const varietal = {
      name: "Varietal 1",
      description: "Description Varietal 2",
    };
    const response = await request(app)
      .post("/varietals")
      .send(varietal)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe(
      "Varietal Varietal 1 exists. Try with another one!"
    );
  });
});

describe("PUT /varietals/:id route -> updated varietal", () => {
  it("it should return a 200 status code -> logout process", async () => {
    const response = await request(app)
      .get("/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });
  it("it should return 401 status code -> not authorized", async () => {
    const varietal = {
      name: "New Name",
      description: "New Description",
    };
    const response = await request(app).put("/varietals/1").send(varietal);
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
    const varietal = {
      name: "New Name",
      description: "New Description",
    };

    const response = await request(app)
      .put("/varietals/1")
      .send(varietal)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("ID invalid format!");
  });
  it("it should return 400 status code -> name and description are empty", async () => {
    const varietal = {};

    const response = await request(app)
      .put(`/varietals/${varietal1_id}`)
      .send(varietal)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Name and description are both empty!");
  });
  it("it should return 404 status code -> varietal not found", async () => {
    const varietal = {
      name: "New Name",
      description: "New Description",
    };

    const response = await request(app)
      .put(`/varietals/2c79ae06-c7d1-40f9-a647-2b7f9508b5ab`)
      .send(varietal)
      .set("Cookie", cookie);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(
      "Varietal with ID: 2c79ae06-c7d1-40f9-a647-2b7f9508b5ab not found!"
    );
  });
  it("it should return 400 status code -> name must be a string", async () => {
    const varietal = {
      name: 1234,
      description: "New Description",
    };

    const response = await request(app)
      .put(`/varietals/${varietal1_id}`)
      .send(varietal)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Name must be a string");
  });
  it("it should return 400 status code -> description must be a string", async () => {
    const varietal = {
      name: "New Name",
      description: true,
    };

    const response = await request(app)
      .put(`/varietals/${varietal1_id}`)
      .send(varietal)
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Description must be a string");
  });
  it("it should return 200 status code -> varietal updated", async () => {
    const varietal = {
      name: "New Name",
      description: "New Description",
    };

    const response = await request(app)
      .put(`/varietals/${varietal1_id}`)
      .send(varietal)
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body.data[0].name).toBe("New Name");
    expect(response.body.data[0].description).toBe("New Description");
  });
  it("it should return 200 status code -> varietal updated only name", async () => {
    const varietal = {
      name: "New Name Varietal 1",
    };

    const response = await request(app)
      .put(`/varietals/${varietal1_id}`)
      .send(varietal)
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body.data[0].name).toBe("New Name Varietal 1");
    expect(response.body.data[0].description).toBe("New Description");
  });
  it("it should return 200 status code -> varietal updated only description", async () => {
    const varietal = {
      description: "New Description Varietal 1",
    };

    const response = await request(app)
      .put(`/varietals/${varietal1_id}`)
      .send(varietal)
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body.data[0].name).toBe("New Name Varietal 1");
    expect(response.body.data[0].description).toBe(
      "New Description Varietal 1"
    );
  });
  it("it should return a 200 status code -> logout process", async () => {
    const response = await request(app)
      .get("/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });
});

describe("DELETE /varietals/:id route -> delete varietal", () => {
  it("it should return 401 status code -> not authorized", async () => {
    const response = await request(app).delete("/varietals/1");
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
      .delete("/varietals/1")
      .set("Cookie", cookie);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("ID invalid format!");
  });
  it("it should return 404 status code -> varietal not found", async () => {
    const response = await request(app)
      .delete("/varietals/2c79ae06-c7d1-40f9-a647-2b7f9508b5ab")
      .set("Cookie", cookie);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(
      `Varietal with ID: 2c79ae06-c7d1-40f9-a647-2b7f9508b5ab not found!`
    );
  });
  it("it should return 200 status code -> varietal deleted", async () => {
    const response = await request(app)
      .delete(`/varietals/${varietal1_id}`)
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body.data[0].id).toBe(varietal1_id);
  });
  it("it should return a 200 status code -> logout process", async () => {
    const response = await request(app)
      .get("/users/logout")
      .set("Cookie", cookie);
    expect(response.status).toBe(200);
    expect(response.body).toBe(true);
  });
});

describe("GET /varietals route -> get all varietals", () => {
  it("it should return 200 status code -> no varietals saved in DB", async () => {
    const response = await request(app).get("/varietals");
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(2);
  });
});

describe("GET /varietals/:id route -> get varietal by id", () => {
  it("it should return 404 status code -> varietal not found", async () => {
    const response = await request(app).get(`/varietals/${varietal1_id}`);
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe(
      `Varietal with ID: ${varietal1_id} not found!`
    );
  });
});

describe("GET /varietals route -> get varietal by name", () => {
  it("it should return 404 status code -> varietal name not found", async () => {
    const response = await request(app).get("/varietals?name=hola");
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("Varietals with name: hola not found!");
  });
  it("it should return 200 status code -> get varietals by name", async () => {
    const response = await request(app).get("/varietals?name=v");
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(2);
  });
  it("it should return 200 status code -> get varietals by name", async () => {
    const response = await request(app).get("/varietals?name=2");
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
  });
});
