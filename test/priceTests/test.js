const request = require("supertest");
const app = require("../../index");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
let jwtCookie;

describe("Authentication", () => {
  it("should authenticate user and obtain JWT cookie", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "aaa", password: "aaa" });

    jwtCookie = response.headers["set-cookie"][0];
  });
});

describe("GET /getAllPrices", () => {
  it("should respond with 200 when authenticated", async () => {
    const response = await request(app)
      .get("/getAllPrices")
      .set("Cookie", jwtCookie);
    expect(response.status).toBe(200);
  });
});

describe("POST /createPrice", () => {
  it("should create a new price", async () => {
    const response = await request(app)
      .post("/createPrice")
      .set("Cookie", jwtCookie)
      .send({ name: "newPrice", objPrice: 50 });

    expect(response.status).toBe(200);

    const createdPrice = await prisma.price.findFirst({
      where: { name: "newPrice" },
    });
    expect(createdPrice).toBeTruthy();
    expect(createdPrice.objPrice).toBe(50);
  });

  it("should return 400 if name is not provided", async () => {
    const response = await request(app)
      .post("/createPrice")
      .set("Cookie", jwtCookie)
      .send({ objPrice: 50 });

    expect(response.status).toBe(400);
  });

  it("should return 400 if objPrice is not provided", async () => {
    const response = await request(app)
      .post("/createPrice")
      .set("Cookie", jwtCookie)
      .send({ name: "newPrice" });

    expect(response.status).toBe(400);
  });
});

describe("PUT /updatePrice", () => {
  it("should update an existing price", async () => {
    const response = await request(app)
      .put("/updatePrice")
      .set("Cookie", jwtCookie)
      .send({ id: "095a2781-3f14-4862-9bef-debf8fc8c6c0", newObjPrice: 200 });

    expect(response.status).toBe(200);

    const updatedPrice = await prisma.price.findUnique({
      where: { id: "095a2781-3f14-4862-9bef-debf8fc8c6c0" },
    });
    expect(updatedPrice.objPrice).toBe(200);
  });

  it("should return 400 if id is not provided", async () => {
    const response = await request(app)
      .put("/updatePrice")
      .set("Cookie", jwtCookie)
      .send({ newObjPrice: 200 });

    expect(response.status).toBe(400);
  });

  it("should return 400 if newObjPrice is not provided", async () => {
    const response = await request(app)
      .put("/updatePrice")
      .set("Cookie", jwtCookie)
      .send({ id: 1 });

    expect(response.status).toBe(400);
  });
});
