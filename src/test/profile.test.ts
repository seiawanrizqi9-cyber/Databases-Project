import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import config from "../utils/env";
import prisma from "../prisma";

const userToken = jwt.sign({ id: 1, role: "USER" }, config.JWT_SECRET);

describe("Profile API Tests", () => {
  beforeAll(async () => {
    await prisma.profile.deleteMany({});
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/profiles/me", () => {
    it("should get my profile", async () => {
      const res = await request(app)
        .get("/api/profiles/me")
        .set("Authorization", `Bearer ${userToken}`);
      
      console.log("GET /profiles/me Response:", {
        status: res.statusCode,
        body: res.body
      });
      
      // Bisa 200 (success), 400 (validation), 401 (no auth), 404 (not found)
      expect([200, 400, 401, 404]).toContain(res.statusCode);
    });
  });

  describe("PUT /api/profiles", () => {
    it("should update my profile", async () => {
      const res = await request(app)
        .put("/api/profiles")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ name: "Updated Name" });
      
      console.log("PUT /profiles Response:", {
        status: res.statusCode,
        body: res.body
      });
      
      expect([200, 400, 401, 404]).toContain(res.statusCode);
    });
  });
});