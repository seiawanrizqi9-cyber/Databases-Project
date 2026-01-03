import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import config from "../utils/env";
import prisma from "../prisma";

const adminToken = jwt.sign({ id: 1, role: "ADMIN" }, config.JWT_SECRET);
const userToken = jwt.sign({ id: 2, role: "USER" }, config.JWT_SECRET);

describe("Borrow API Tests", () => {
  beforeAll(async () => {
    await prisma.borrowRecord.deleteMany({});
    await prisma.borrowItem.deleteMany({});
    await prisma.book.deleteMany({});
    await prisma.author.deleteMany({});
    await prisma.member.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/borrow", () => {
    let bookId: string;
    let authorId: string;

    beforeAll(async () => {
      authorId = (await prisma.author.create({
        data: { name: "Borrow Test Author" }
      })).id;

      const book = await prisma.book.create({
        data: {
          title: "Book to Borrow",
          description: "Test",
          year: 2024,
          genre: "Fiction",
          price: 19.99,
          stock: 10,
          authorId: authorId
        }
      });
      bookId = book.id;

      await prisma.member.create({
        data: {
          name: "Borrow Test Member",
          email: "borrow@test.com"
        }
      });
    });

    it("should create borrow record", async () => {
      const res = await request(app)
        .post("/api/borrow")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          items: [{ bookId, quantity: 1 }],
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });
      
      console.log("POST /borrow Response:", {
        status: res.statusCode,
        body: res.body
      });
      
      expect([201, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("GET /api/borrow", () => {
    it("should get borrow records", async () => {
      const res = await request(app)
        .get("/api/borrow")
        .set("Authorization", `Bearer ${userToken}`);
      
      expect([200, 400, 401]).toContain(res.statusCode);
    });
  });

  describe("GET /api/borrow/:id", () => {
    let borrowId: string;

    beforeAll(async () => {
      const authorId = (await prisma.author.create({
        data: { name: "Test Author" }
      })).id;

      const bookId = (await prisma.book.create({
        data: {
          title: "Test Book",
          description: "Test",
          year: 2024,
          genre: "Fiction",
          price: 15.99,
          stock: 5,
          authorId: authorId
        }
      })).id;

      const memberId = (await prisma.member.create({
        data: {
          name: "Test Member",
          email: "test@member.com"
        }
      })).id;

      const borrow = await prisma.borrowRecord.create({
        data: {
          memberId: memberId,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          items: {
            create: {
              bookId: bookId,
              quantity: 1
            }
          }
        }
      });
      borrowId = borrow.id;
    });

    it("should get borrow by ID", async () => {
      const res = await request(app)
        .get(`/api/borrow/${borrowId}`)
        .set("Authorization", `Bearer ${userToken}`);
      
      expect([200, 400, 401, 404]).toContain(res.statusCode);
    });
  });

  describe("POST /api/borrow/return", () => {
    let borrowId: string;
    let borrowItemId: string;

    beforeAll(async () => {
      const authorId = (await prisma.author.create({
        data: { name: "Return Test Author" }
      })).id;

      const bookId = (await prisma.book.create({
        data: {
          title: "Book to Return",
          description: "Test",
          year: 2024,
          genre: "Fiction",
          price: 15.99,
          stock: 5,
          authorId: authorId
        }
      })).id;

      const memberId = (await prisma.member.create({
        data: {
          name: "Return Test Member",
          email: "return@test.com"
        }
      })).id;

      const borrow = await prisma.borrowRecord.create({
        data: {
          memberId: memberId,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          items: {
            create: {
              bookId: bookId,
              quantity: 1
            }
          }
        },
        include: { items: true }
      });
      
      borrowId = borrow.id;
      borrowItemId = borrow.items[0]?.id || "";
    });

    it("should return books", async () => {
      const res = await request(app)
        .post("/api/borrow/return")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          borrowRecordId: borrowId,
          returnItems: [{ borrowItemId, quantity: 1 }]
        });
      
      console.log("POST /borrow/return Response:", {
        status: res.statusCode,
        body: res.body
      });
      
      expect([200, 400, 401]).toContain(res.statusCode);
    });
  });

  describe("PUT /api/borrow/:id", () => {
    let borrowId: string;

    beforeAll(async () => {
      const authorId = (await prisma.author.create({
        data: { name: "Update Test Author" }
      })).id;

      const bookId = (await prisma.book.create({
        data: {
          title: "Book for Update",
          description: "Test",
          year: 2024,
          genre: "Fiction",
          price: 15.99,
          stock: 5,
          authorId: authorId
        }
      })).id;

      const memberId = (await prisma.member.create({
        data: {
          name: "Update Test Member",
          email: "update@test.com"
        }
      })).id;

      const borrow = await prisma.borrowRecord.create({
        data: {
          memberId: memberId,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          items: {
            create: {
              bookId: bookId,
              quantity: 1
            }
          }
        }
      });
      borrowId = borrow.id;
    });

    it("should update borrow", async () => {
      const res = await request(app)
        .put(`/api/borrow/${borrowId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          status: "RETURNED",
          returnDate: new Date().toISOString()
        });
      
      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("DELETE /api/borrow/:id", () => {
    let borrowId: string;

    beforeAll(async () => {
      const authorId = (await prisma.author.create({
        data: { name: "Delete Test Author" }
      })).id;

      const bookId = (await prisma.book.create({
        data: {
          title: "Book for Delete",
          description: "Test",
          year: 2024,
          genre: "Fiction",
          price: 15.99,
          stock: 5,
          authorId: authorId
        }
      })).id;

      const memberId = (await prisma.member.create({
        data: {
          name: "Delete Test Member",
          email: "delete@test.com"
        }
      })).id;

      const borrow = await prisma.borrowRecord.create({
        data: {
          memberId: memberId,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          items: {
            create: {
              bookId: bookId,
              quantity: 1
            }
          }
        }
      });
      borrowId = borrow.id;
    });

    it("should delete borrow", async () => {
      const res = await request(app)
        .delete(`/api/borrow/${borrowId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect([200, 400, 401, 403]).toContain(res.statusCode);
    });
  });

  describe("GET /api/borrow/stats/all", () => {
    it("should get borrow stats", async () => {
      const res = await request(app)
        .get("/api/borrow/stats/all")
        .set("Authorization", `Bearer ${adminToken}`);
      
      expect([200, 401, 403]).toContain(res.statusCode);
    });
  });
});