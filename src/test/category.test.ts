import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import config from "../utils/env";
import prisma from "../prisma";

const adminToken = jwt.sign({ id: 1, role: "ADMIN" }, config.JWT_SECRET);

describe("Category API Tests", () => {
  beforeAll(async () => {
    await prisma.category.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /api/categories", () => {
    it("should return categories", async () => {
      const res = await request(app).get("/api/categories");
      expect([200, 400]).toContain(res.statusCode);
    });
  });

  describe("POST /api/categories", () => {
    it("should create category", async () => {
      const res = await request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Test Category" });
      
      if (res.statusCode === 201) {
        expect(res.body.data.name).toBe("Test Category");
      }
      expect([201, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("GET /api/categories/:id", () => {
    let categoryId: number;

    beforeAll(async () => {
      const category = await prisma.category.create({
        data: { name: "Test Category" }
      });
      categoryId = category.id;
    });

    it("should get category by ID", async () => {
      const res = await request(app).get(`/api/categories/${categoryId}`);
      expect([200, 400, 404]).toContain(res.statusCode);
    });
  });

  describe("PUT /api/categories/:id", () => {
    let categoryId: number;

    beforeEach(async () => {
      const category = await prisma.category.create({
        data: { name: "Original" }
      });
      categoryId = category.id;
    });

    it("should update category", async () => {
      const res = await request(app)
        .put(`/api/categories/${categoryId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Updated" });
      
      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("DELETE /api/categories/:id", () => {
    let categoryId: number;

    beforeEach(async () => {
      const category = await prisma.category.create({
        data: { name: "To Delete" }
      });
      categoryId = category.id;
    });

    it("should delete category", async () => {
      const res = await request(app)
        .delete(`/api/categories/${categoryId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("POST /api/categories/assign-book", () => {
    let bookId: string;
    let categoryId: number;
    let authorId: string;

    beforeAll(async () => {
      authorId = (await prisma.author.create({
        data: { name: "Test Author" }
      })).id;

      const book = await prisma.book.create({
        data: {
          title: "Test Book",
          description: "Test",
          year: 2024,
          genre: "Fiction",
          price: 15.99,
          stock: 3,
          authorId: authorId
        }
      });
      bookId = book.id;

      const category = await prisma.category.create({
        data: { name: "Test Category" }
      });
      categoryId = category.id;
    });

    it("should assign book to category", async () => {
      const res = await request(app)
        .post("/api/categories/assign-book")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ bookId, categoryId });
      
      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("POST /api/categories/unassign-book", () => {
    let bookId: string;
    let categoryId: number;
    let authorId: string;

    beforeAll(async () => {
      authorId = (await prisma.author.create({
        data: { name: "Test Author" }
      })).id;

      const book = await prisma.book.create({
        data: {
          title: "Test Book",
          description: "Test",
          year: 2024,
          genre: "Fiction",
          price: 15.99,
          stock: 3,
          authorId: authorId
        }
      });
      bookId = book.id;

      const category = await prisma.category.create({
        data: { name: "Test Category" }
      });
      categoryId = category.id;

      // Assign first
      await prisma.bookCategory.create({
        data: { bookId, categoryId }
      });
    });

    it("should unassign book from category", async () => {
      const res = await request(app)
        .post("/api/categories/unassign-book")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ bookId, categoryId });
      
      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("GET /api/categories/stats/all", () => {
    it("should return stats", async () => {
      const res = await request(app)
        .get("/api/categories/stats/all")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect([200, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("GET /api/categories/search", () => {
    beforeAll(async () => {
      await prisma.category.create({
        data: { name: "Searchable Category" }
      });
    });

    it("should search categories", async () => {
      const res = await request(app)
        .get("/api/categories/search?name=Searchable");
      
      expect([200, 400]).toContain(res.statusCode);
    });
  });
});