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

let user1_id;

describe("POST /users/register route -> create new user", () => {
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

let cookie;

describe("POST /users/login route -> login process", () => {
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
});

describe("GET /varietals route -> no varietals saved in DB", () => {
  it("it should return 404 status code -> no varietals saved in DB", async () => {
    const response = await request(app).get("/varietals");
    expect(response.status).toBe(404);
    expect(response.body.msg).toBe("No varietals saved in DB!");
  });
});

describe("POST /varietals route -> Create new varietal validations", () => {
  it("it should return 400 status code -> name parameter is missing", async () => {
    const varietal = {
      description: "Description Varietal 1",
    };

    const response = await request(app).post("/varietals").send(varietal);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Name parameter is missing");
  });
  it("it should return 400 status code -> name must be a string", async () => {
    const varietal = {
      name: 1234,
      description: "Description Varietal 1",
    };

    const response = await request(app).post("/varietals").send(varietal);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Name must be a string");
  });
  it("it should return 400 status code -> description parameter is missing", async () => {
    const varietal = {
      name: "Varietal 1",
    };

    const response = await request(app).post("/varietals").send(varietal);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Description parameter is missing");
  });
  it("it should return 400 status code -> description must be a string", async () => {
    const varietal = {
      name: "Varietal 1",
      description: 1234,
    };

    const response = await request(app).post("/varietals").send(varietal);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Description must be a string");
  });
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

describe("GET /varietals route -> get all varietals", () => {
  it("it should return 200 status code -> get all varietals", async () => {
    const response = await request(app).get("/varietals");
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
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
    const response = await request(app).post("/varietals").send(varietal);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe(
      "Varietal Varietal 1 exists. Try with another one!"
    );
  });
});

describe("PUT /varietals/:id route -> updated varietal", () => {
  it("it should return 400 status code -> id invalid format", async () => {
    const varietal = {
      name: "New Name",
      description: "New Description",
    };

    const response = await request(app).put("/varietals/1").send(varietal);
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("ID invalid format!");
  });
  it("it should return 400 status code -> name and description are empty", async () => {
    const varietal = {};

    const response = await request(app)
      .put(`/varietals/${varietal1_id}`)
      .send(varietal);
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
      .send(varietal);
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
      .send(varietal);
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
      .send(varietal);
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
      .send(varietal);
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
      .send(varietal);
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
      .send(varietal);
    expect(response.status).toBe(200);
    expect(response.body.data[0].name).toBe("New Name Varietal 1");
    expect(response.body.data[0].description).toBe(
      "New Description Varietal 1"
    );
  });
});
