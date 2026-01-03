import request from "supertest";
import app from "../app.js";
import jwt from "jsonwebtoken";
import config from "../utils/env.js";
import path from "path";
describe("GET /api/books", () => {
    it("should return 200 and list of book", async () => {
        const res = await request(app).get("/api/books");
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});
describe("POST /api/books", () => {
    const token = jwt.sign({ id: 1, role: "ADMIN" }, config.JWT_SECRET);
    it("Should return 201 and book that has been created", async () => {
        // CREATE AUTHOR FIRST (sama seperti category di product)
        const authorRes = await request(app)
            .post("/api/authors")
            .set("Authorization", `Bearer ${token}`)
            .field("name", "test author")
            .field("bio", "test bio");
        const authorId = authorRes.body.data.id;
        const res = await request(app)
            .post("/api/books")
            .set("Authorization", `Bearer ${token}`)
            .field("title", "test")
            .field("description", "test")
            .field("year", "2023")
            .field("genre", "Fiction")
            .field("price", "29.99")
            .field("stock", "10")
            .field("authorId", authorId)
            .attach("image", path.resolve(__dirname, "../../hacker.jpg"));
        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
    });
});
describe("GET /api/books/:id", () => {
    it("should return 200 for existing book", async () => {
        const token = jwt.sign({ id: 1, role: "ADMIN" }, config.JWT_SECRET);
        // CREATE AUTHOR FIRST
        const authorRes = await request(app)
            .post("/api/authors")
            .set("Authorization", `Bearer ${token}`)
            .field("name", "author for get test")
            .field("bio", "test bio");
        const authorId = authorRes.body.data.id;
        const createRes = await request(app)
            .post("/api/books")
            .field("title", "book for get test")
            .field("description", "test")
            .field("year", "2023")
            .field("genre", "Fiction")
            .field("price", "25.50")
            .field("stock", "5")
            .field("authorId", authorId)
            .attach("image", path.resolve(__dirname, "../../hacker.jpg"))
            .set("Authorization", `Bearer ${token}`);
        const bookId = createRes.body.data.id;
        const res = await request(app).get(`/api/books/${bookId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });
    it("should return 400 for invalid book ID", async () => {
        const res = await request(app).get("/api/books/abc");
        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBe(false);
    });
});
describe("PUT /api/books/:id", () => {
    const token = jwt.sign({ id: 1, role: "ADMIN" }, config.JWT_SECRET);
    it("should return 200 and update book", async () => {
        // CREATE AUTHOR FIRST
        const authorRes = await request(app)
            .post("/api/authors")
            .set("Authorization", `Bearer ${token}`)
            .field("name", "original author")
            .field("bio", "original bio");
        const authorId = authorRes.body.data.id;
        // First create a book
        const createRes = await request(app)
            .post("/api/books")
            .field("title", "book to update")
            .field("description", "test")
            .field("year", "2020")
            .field("genre", "Fiction")
            .field("price", "15.99")
            .field("stock", "3")
            .field("authorId", authorId)
            .attach("image", path.resolve(__dirname, "../../hacker.jpg"))
            .set("Authorization", `Bearer ${token}`);
        const bookId = createRes.body.data.id;
        // Update book - PAKAI .send() untuk JSON
        const res = await request(app)
            .put(`/api/books/${bookId}`)
            .send({
            title: "updated book",
            description: "updated",
            year: 2024,
            genre: "Science Fiction",
            price: 19.99,
            stock: 15
        })
            .set("Authorization", `Bearer ${token}`)
            .set("Content-Type", "application/json");
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });
});
describe("DELETE /api/books/:id", () => {
    const token = jwt.sign({ id: 1, role: "ADMIN" }, config.JWT_SECRET);
    it("should return 200 and delete book", async () => {
        // CREATE AUTHOR FIRST
        const authorRes = await request(app)
            .post("/api/authors")
            .set("Authorization", `Bearer ${token}`)
            .field("name", "author for delete")
            .field("bio", "bio");
        const authorId = authorRes.body.data.id;
        // First create a book
        const createRes = await request(app)
            .post("/api/books")
            .field("title", "book to delete")
            .field("description", "test")
            .field("year", "2023")
            .field("genre", "Test")
            .field("price", "10.99")
            .field("stock", "2")
            .field("authorId", authorId)
            .attach("image", path.resolve(__dirname, "../../hacker.jpg"))
            .set("Authorization", `Bearer ${token}`);
        const bookId = createRes.body.data.id;
        // Delete book
        const res = await request(app)
            .delete(`/api/books/${bookId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
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
//# sourceMappingURL=book.test.js.map
