import express, {} from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "./middleware/error.handler";
import { successResponse } from "./utils/response";
import authRouter from "./routes/auth.route";
import bookRouter from "./routes/book.route";
import authorRouter from "./routes/author.route";
import borrowRouter from "./routes/borrow.route";
import memberRouter from "./routes/member.route";
import categoryRouter from "./routes/category.route";
import profileRouter from "./routes/profile.route";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './utils/swagger';
const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("public"));
app.set("query parser", "extended");
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/", (req, res) => {
    const waktu = Date.now() - (req.startTime || 0);
    successResponse(res, "Selamat Datang di API Perpustakaan Digital!", {
        status: "Server hidup!",
        message: `Halo pemilik API Key: ${req.apikey}!`,
        waktu_proses: `${waktu}ms`,
        endpoints: {
            auth: [
                { path: "/api/auth/login", method: "POST", description: "Login user/member" },
                { path: "/api/auth/register", method: "POST", description: "Register user baru" },
            ],
            books: [
                { path: "/api/books", method: "GET", description: "Menampilkan semua buku" },
                { path: "/api/books/:id", method: "GET", description: "Menampilkan buku berdasarkan ID" },
                { path: "/api/books/search", method: "GET", description: "Mencari buku" },
                { path: "/api/books", method: "POST", description: "Menambahkan buku baru (Admin only)" },
                { path: "/api/books/:id", method: "PUT", description: "Mengubah buku (Admin only)" },
                { path: "/api/books/:id", method: "DELETE", description: "Menghapus buku (Admin only)" },
            ],
            authors: [
                { path: "/api/authors", method: "GET", description: "Menampilkan semua author" },
                { path: "/api/authors/:id", method: "GET", description: "Menampilkan author berdasarkan ID" },
                { path: "/api/authors/search", method: "GET", description: "Mencari author" },
                { path: "/api/authors", method: "POST", description: "Menambahkan author baru (Admin only)" },
                { path: "/api/authors/:id", method: "PUT", description: "Mengubah author (Admin only)" },
                { path: "/api/authors/:id", method: "DELETE", description: "Menghapus author (Admin only)" },
            ],
            borrow: [
                { path: "/api/borrow", method: "POST", description: "Meminjam buku (Member only)" },
                { path: "/api/borrow/my", method: "GET", description: "Lihat riwayat peminjaman sendiri (Member only)" },
                { path: "/api/borrow/return", method: "POST", description: "Mengembalikan buku (Auth required)" },
                { path: "/api/borrow", method: "GET", description: "Lihat semua peminjaman (Auth required)" },
                { path: "/api/borrow/:id", method: "GET", description: "Lihat detail peminjaman (Auth required)" },
                { path: "/api/borrow/:id", method: "PUT", description: "Update peminjaman (Admin only)" },
                { path: "/api/borrow/:id", method: "DELETE", description: "Hapus peminjaman (Admin only)" },
            ],
            members: [
                { path: "/api/members", method: "GET", description: "Menampilkan semua member (Admin only)" },
                { path: "/api/members/:id", method: "GET", description: "Menampilkan member berdasarkan ID (Admin only)" },
                { path: "/api/members/search", method: "GET", description: "Mencari member (Admin only)" },
                { path: "/api/members", method: "POST", description: "Menambahkan member baru (Public)" },
                { path: "/api/members/:id", method: "PUT", description: "Mengubah member (Admin only)" },
                { path: "/api/members/:id", method: "DELETE", description: "Menghapus member (Admin only)" },
            ],
            categories: [
                { path: "/api/categories", method: "GET", description: "Menampilkan semua kategori" },
                { path: "/api/categories/:id", method: "GET", description: "Menampilkan kategori berdasarkan ID" },
                { path: "/api/categories/search", method: "GET", description: "Mencari kategori" },
                { path: "/api/categories", method: "POST", description: "Menambahkan kategori baru (Admin only)" },
                { path: "/api/categories/:id", method: "PUT", description: "Mengubah kategori (Admin only)" },
                { path: "/api/categories/:id", method: "DELETE", description: "Menghapus kategori (Admin only)" },
                { path: "/api/categories/assign-book", method: "POST", description: "Menambahkan buku ke kategori (Admin only)" },
                { path: "/api/categories/unassign-book", method: "POST", description: "Menghapus buku dari kategori (Admin only)" },
            ],
            profiles: [
                { path: "/api/profiles", method: "GET", description: "Menampilkan semua profile (Auth required)" },
                { path: "/api/profiles/:id", method: "GET", description: "Menampilkan profile berdasarkan ID (Auth required)" },
                { path: "/api/profiles/user/:userId", method: "GET", description: "Menampilkan profile berdasarkan user ID (Auth required)" },
                { path: "/api/profiles", method: "POST", description: "Membuat profile baru (Public)" },
                { path: "/api/profiles/:id", method: "PUT", description: "Mengubah profile (Auth required)" },
                { path: "/api/profiles/:id", method: "DELETE", description: "Menghapus profile (Auth required)" },
            ],
        },
    });
});
app.use((req, _res, next) => {
    console.log(`Request masuk: ${req.method} ${req.path}`);
    req.startTime = Date.now();
    next();
});
app.use("/api/auth", authRouter);
app.use("/api/books", bookRouter);
app.use("/api/authors", authorRouter);
app.use("/api/borrow", borrowRouter);
app.use("/api/members", memberRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/profiles", profileRouter);
app.use(/.*/, (req, _res) => {
    throw new Error(`Route ${req.originalUrl} tidak ditemukan`);
});
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map