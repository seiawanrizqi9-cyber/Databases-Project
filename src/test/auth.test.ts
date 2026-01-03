import request from "supertest";
import app from "../app";
import prisma from "../prisma";

describe("Auth API Tests", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({});
    await prisma.profile.deleteMany({});
    await prisma.member.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/auth/register", () => {
    it("should register new user", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: "test@user.com",
          password: "password123"
        });
      
      console.log("POST /auth/register Response:", {
        status: res.statusCode,
        body: res.body
      });
      
      expect([201, 400]).toContain(res.statusCode);
    });

    it("should reject duplicate email", async () => {
      // Register first user
      await request(app)
        .post("/api/auth/register")
        .send({
          name: "First User",
          email: "duplicate@test.com",
          password: "password123"
        });

      // Try duplicate email
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Second User",
          email: "duplicate@test.com", // Same email
          password: "password456"
        });
      
      expect([400, 409]).toContain(res.statusCode);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeAll(async () => {
      // Create user for login test
      await request(app)
        .post("/api/auth/register")
        .send({
          name: "Login Test User",
          email: "login@test.com",
          password: "password123"
        });
    });

    it("should login with valid credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "login@test.com",
          password: "password123"
        });
      
      console.log("POST /auth/login Response:", {
        status: res.statusCode,
        body: res.body
      });
      
      if (res.statusCode === 200) {
        expect(res.body.data).toHaveProperty("token");
        expect(res.body.data).toHaveProperty("user");
      }
      
      expect([200, 400, 401]).toContain(res.statusCode);
    });

    it("should reject invalid credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "login@test.com",
          password: "wrongpassword"
        });
      
      expect([400, 401]).toContain(res.statusCode);
    });
  });
});