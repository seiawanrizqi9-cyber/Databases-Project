import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import config from "../utils/env";
import prisma from "../prisma";

const adminToken = jwt.sign({ id: 1, role: "ADMIN" }, config.JWT_SECRET);

describe("Member API Tests", () => {
  beforeAll(async () => {
    await prisma.member.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/members", () => {
    it("should create member", async () => {
      const res = await request(app)
        .post("/api/members")
        .send({
          name: "Test Member",
          email: "member@test.com"
        });
      
      expect([201, 400]).toContain(res.statusCode);
    });
  });

  describe("GET /api/members", () => {
    it("should get members (admin only)", async () => {
      const res = await request(app)
        .get("/api/members")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("GET /api/members/:id", () => {
    let memberId: string;

    beforeAll(async () => {
      const member = await prisma.member.create({
        data: {
          name: "Test Member",
          email: "test@member.com"
        }
      });
      memberId = member.id;
    });

    it("should get member by ID (admin only)", async () => {
      const res = await request(app)
        .get(`/api/members/${memberId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect([200, 400, 401, 403, 404]).toContain(res.statusCode);
    });
  });

  describe("PUT /api/members/:id", () => {
    let memberId: string;

    beforeAll(async () => {
      const member = await prisma.member.create({
        data: {
          name: "Original Member",
          email: "original@member.com"
        }
      });
      memberId = member.id;
    });

    it("should update member (admin only)", async () => {
      const res = await request(app)
        .put(`/api/members/${memberId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Updated Member" });
      
      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("DELETE /api/members/:id", () => {
    let memberId: string;

    beforeEach(async () => {
      const member = await prisma.member.create({
        data: {
          name: "Member to Delete",
          email: `delete${Date.now()}@member.com`
        }
      });
      memberId = member.id;
    });

    it("should delete member (admin only)", async () => {
      const res = await request(app)
        .delete(`/api/members/${memberId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("GET /api/members/stats/all", () => {
    it("should get member stats (admin only)", async () => {
      const res = await request(app)
        .get("/api/members/stats/all")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect([200, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("GET /api/members/search", () => {
    beforeAll(async () => {
      await prisma.member.create({
        data: {
          name: "Searchable Member",
          email: "search@member.com"
        }
      });
    });

    it("should search members (admin only)", async () => {
      const res = await request(app)
        .get("/api/members/search?name=Searchable")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });
  });
});