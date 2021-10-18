import supertest from "supertest";
import faker from "faker";
import app from "../../app.js";

const request = supertest(app);

describe("Tests all CRUD functions for user signup service ", () => {
  // SECTION : POST API
  it("POST /api/users/signup with missing email -> 400 ", async () => {
    // we are using faker dev dependency for fake username, password, and name
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    // const email = `${firstName[0]}${lastName}@patriots.uttyler.edu`;
    const password = "password";
    const phoneNumber = faker.phone.phoneNumber();
  });

  it("POST /api/users/signup with wrong email address -> 400 ", async () => {
    const email = faker.internet.email().toLowerCase();
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const password = faker.internet.password();

    const response = await request.post("/api/users/signup").send({
      firstName,
      lastName,
      email,
      password,
    });
    expect(response.status).toBe(400);
  });

  it("POST /api/users/signup with missing password -> 400 ", async () => {
    const email = faker.internet.email().toLowerCase();
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    // const password = faker.internet.password();

    const response = await request.post("/api/users/signup").send({
      firstName,
      lastName,
      email,
      //   password,
    });
    expect(response.status).toBe(400);
  });

  it("POST /api/users/signup with short password -> 400 ", async () => {
    const email = faker.internet.email().toLowerCase();
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const password = "123";

    const response = await request.post("/api/users/signup").send({
      firstName,
      lastName,
      email,
      password,
    });
    expect(response.status).toBe(400);
  });

  it("POST /api/users/signup -->  registers new user", async () => {
    // we are using faker dev dependency for fake username, password, and name
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = `${firstName[0]}${lastName}@patriots.uttyler.edu`;
    const password = "password";
    const phoneNumber = faker.phone.phoneNumber();

    const response = await request
      .post("/api/users/signup")
      .send({
        email,
        firstName,
        lastName,
        password,
        phoneNumber,
      })
      .expect("Content-Type", /json/)
      .expect(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        uid: expect.any(Number),
        email: expect.any(String),
        token: expect.any(String),
      })
    );
  });

  it("POST /api/users/signup -->  user account already exists", async () => {
    // we are using faker dev dependency for fake username, password, and name
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = `${firstName[0]}${lastName}@patriots.uttyler.edu`;
    const password = "password";
    const phoneNumber = faker.phone.phoneNumber();

    const response = await request
      .post("/api/users/signup")
      .send({
        email,
        firstName,
        lastName,
        password,
        phoneNumber,
      })
      .expect("Content-Type", /json/)
      .expect(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        uid: expect.any(Number),
        email: expect.any(String),
        token: expect.any(String),
      })
    );

    request
      .post("/api/users/signup")
      .send({
        email,
        firstName,
        lastName,
        password,
        phoneNumber,
      })
      .expect("Content-Type", /json/)
      .expect(400);
  });
});
