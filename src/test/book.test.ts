import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import config from "../utils/env";
import path from "path";

describe("GET /api/books", () => {
  it("should return 200 and list of books", async () => {
    const res = await request(app).get("/api/books");

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe("POST /api/books", () => {
  const token = jwt.sign({ id: 1, role: "ADMIN" }, config.JWT_SECRET);

  it("Should return 201 and book that has been created", async () => {
    const res = await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${token}`)
      .field("title", "test")
      .field("description", "test")
      .field("year", "2023")
      .field("genre", "Fiction")
      .field("price", "25.99")
      .field("stock", "10")
      .field("authorId", "VALID_AUTHOR_ID_HERE") // GANTI DENGAN ID AUTHOR YANG SUDAH ADA
      .attach("image", path.resolve(__dirname, "../../test-image.jpg"));

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
  });
});

describe("GET /api/books/:id", () => {
  it("should return 200 for existing book", async () => {
    const booksRes = await request(app).get("/api/books");
    if (booksRes.body.data.length > 0) {
      const bookId = booksRes.body.data[0].id;
      const res = await request(app).get(`/api/books/${bookId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
    } else {
      console.log("Tidak ada buku di database, skip test");
    }
  });

  it("should return 400 for invalid book ID", async () => {
    const res = await request(app).get("/api/books/abc");
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });
});

describe("GET /api/books/search", () => {
  it("should return 200 and search results", async () => {
    const res = await request(app)
      .get("/api/books/search")
      .query({ genre: "Fiction", minPrice: 10, maxPrice: 50 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe("GET /api/books/stats/all", () => {
  const token = jwt.sign({ id: 1, role: "ADMIN" }, config.JWT_SECRET);

  it("should return 200 and book stats", async () => {
    const res = await request(app)
      .get("/api/books/stats/all")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});