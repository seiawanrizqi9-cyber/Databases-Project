import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import config from "../utils/env";
import path from "path";
import prisma from "../prisma";

// Token untuk admin (jika diperlukan)
const adminToken = jwt.sign(
  { id: 1, role: "ADMIN" },
  config.JWT_SECRET
);

describe("Book API Tests", () => {
  let authorId: string;
  let bookId: string;

  // Setup sebelum semua test
  beforeAll(async () => {
    // Clean database
    await prisma.book.deleteMany({});
    await prisma.author.deleteMany({});
    
    // Create test author
    const author = await prisma.author.create({
      data: {
        name: "Test Author",
        bio: "Test Bio"
      }
    });
    authorId = author.id;
    console.log("Author ID:", authorId);
  });

  // Cleanup setelah semua test
  afterAll(async () => {
    await prisma.$disconnect();
  });

  // ==================== GET /api/books ====================
  describe("GET /api/books", () => {
    it("should return 200 and list of books", async () => {
      const res = await request(app).get("/api/books");
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  // ==================== POST /api/books ====================
  describe("POST /api/books", () => {
    it("should create a new book with image", async () => {
      const res = await request(app)
        .post("/api/books")
        .set("Authorization", `Bearer ${adminToken}`)
        .field("title", "New Test Book")
        .field("description", "Book Description")
        .field("year", "2024")
        .field("genre", "Fiction")
        .field("price", "19.99")
        .field("stock", "5")
        .field("authorId", authorId)
        .attach("image", path.resolve(__dirname, "../../hacker.jpg"));

      console.log("Create Response:", res.body);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.title).toBe("New Test Book");
      
      // Save book ID for other tests
      bookId = res.body.data.id;
    });
  });

  // ==================== GET /api/books/:id ====================
  describe("GET /api/books/:id", () => {
    it("should get book by ID", async () => {
      // Pastikan ada book yang dibuat
      if (!bookId) {
        // Create a book first
        const createRes = await request(app)
          .post("/api/books")
          .set("Authorization", `Bearer ${adminToken}`)
          .field("title", "Book for Get Test")
          .field("description", "Description")
          .field("year", "2024")
          .field("genre", "Fiction")
          .field("price", "25.00")
          .field("stock", "3")
          .field("authorId", authorId)
          .attach("image", path.resolve(__dirname, "../../hacker.jpg"));
        
        bookId = createRes.body.data.id;
      }

      const res = await request(app).get(`/api/books/${bookId}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(bookId);
    });

    it("should return error for invalid ID", async () => {
      const res = await request(app).get("/api/books/invalid");
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // ==================== PUT /api/books/:id ====================
  describe("PUT /api/books/:id", () => {
    let updateBookId: string;

    beforeEach(async () => {
      // Create a book for update test
      const createRes = await request(app)
        .post("/api/books")
        .set("Authorization", `Bearer ${adminToken}`)
        .field("title", "Book to Update")
        .field("description", "Original")
        .field("year", "2023")
        .field("genre", "Original Genre")
        .field("price", "10.00")
        .field("stock", "1")
        .field("authorId", authorId)
        .attach("image", path.resolve(__dirname, "../../hacker.jpg"));
      
      updateBookId = createRes.body.data.id;
    });

    it("should update book details", async () => {
      const res = await request(app)
        .put(`/api/books/${updateBookId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .field("title", "Updated Title")
        .field("price", "15.00")
        .field("stock", "10");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe("Updated Title");
    });
  });

  // ==================== DELETE /api/books/:id ====================
  describe("DELETE /api/books/:id", () => {
    it("should delete a book", async () => {
      // Create a book for delete test
      const createRes = await request(app)
        .post("/api/books")
        .set("Authorization", `Bearer ${adminToken}`)
        .field("title", "Book to Delete")
        .field("description", "Delete Me")
        .field("year", "2023")
        .field("genre", "Test")
        .field("price", "5.00")
        .field("stock", "1")
        .field("authorId", authorId)
        .attach("image", path.resolve(__dirname, "../../hacker.jpg"));
      
      const deleteBookId = createRes.body.data.id;

      const res = await request(app)
        .delete(`/api/books/${deleteBookId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ==================== GET /api/books/stats/all ====================
  describe("GET /api/books/stats/all", () => {
    it("should return book statistics", async () => {
      const res = await request(app).get("/api/books/stats/all");
      
      // Bisa 200 (public) atau perlu auth
      expect([200, 401]).toContain(res.statusCode);
      
      if (res.statusCode === 200) {
        expect(res.body.success).toBe(true);
        expect(res.body.data).toBeDefined();
      }
    });
  });
});