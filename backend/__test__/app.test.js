const request = require("supertest");
const app = require("../server");

describe("POST /register", () => {
  it("Должен регистрировать нового пользователя", async () => {
    const newUser = {
      username: "testuser",
      password: "testpassword",
    };
    const response = await request(app)
      .post("/register")
      .send(newUser)
      .expect(200);

    expect(response.body.username).toEqual(newUser.username);
  });

  it("Должен возвращать ошибку 400, если пользователь уже существует", async () => {
    const existingUser = {
      username: "testuser",
      password: "testpassword",
    };
    await request(app).post("/register").send(existingUser).expect(400);
  });
});

describe("POST /login", () => {
  it("Должен возвращать токен доступа при успешной аутентификации", async () => {
    const userCredentials = {
      username: "testuser",
      password: "testpassword",
    };
    const response = await request(app)
      .post("/login")
      .send(userCredentials)
      .expect(200);

    expect(response.body.accessToken).toBeTruthy();
  });

  it("Должен возвращать ошибку 401 при неверных учетных данных", async () => {
    const invalidCredentials = {
      username: "invaliduser",
      password: "invalidpassword",
    };
    await request(app).post("/login").send(invalidCredentials).expect(401);
  });
});

describe("GET /posts", () => {
  it("Должен возвращать список постов при наличии токена аутентификации", async () => {
    const userCredentials = {
      username: "testuser",
      password: "testpassword",
    };
    const loginResponse = await request(app)
      .post("/login")
      .send(userCredentials);
    const accessToken = loginResponse.body.accessToken;

    const response = await request(app)
      .get("/posts")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it("Должен возвращать ошибку 401 при отсутствии токена аутентификации", async () => {
    await request(app).get("/posts").expect(401);
  });
});

describe("POST /posts", () => {
  it("Должен создавать новый пост при наличии токена аутентификации", async () => {
    const userCredentials = {
      username: "testuser",
      password: "testpassword",
    };
    const loginResponse = await request(app)
      .post("/login")
      .send(userCredentials);
    const accessToken = loginResponse.body.accessToken;

    const newPost = {
      title: "Test Post",
      content: "This is a test post content",
    };
    const response = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newPost)
      .expect(200);

    expect(response.body.title).toEqual(newPost.title);
    expect(response.body.content).toEqual(newPost.content);
  });

  it("Должен возвращать ошибку 401 при отсутствии токена аутентификации", async () => {
    const newPost = {
      title: "Test Post",
      content: "This is a test post content",
    };
    await request(app).post("/posts").send(newPost).expect(401);
  });
});
