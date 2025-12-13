import express, {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "./middleware/error.handler";
import { successResponse } from "./utils/response";
import bookRouter from "./routes/book.route";
import authorRouter from "./routes/author.route";
import loanRouter from "./routes/loan.route";
import memberRouter from "./routes/member.route";
import magicRouter from "./routes/magic.route";

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// API Key Middleware (SAMA seperti kemarin)
app.use((req: Request, res: Response, next: NextFunction) => {
  req.startTime = Date.now();
  const apiKey = req.headers["x-api-key"] as string;
  
  if (!apiKey) {
    return res.status(401).json({ 
      success: false, 
      message: "Kirim header X-API-Key" 
    });
  }
  
  if (apiKey !== "katasandi123") {
    return res.status(401).json({ 
      success: false, 
      message: "API Key tidak valid!" 
    });
  }
  
  req.apikey = apiKey;
  next();
});

// Home endpoint (DIPERBARUI dengan resource baru)
app.get("/", (req: Request, res: Response) => {
  const waktu = Date.now() - (req.startTime || 0);
  successResponse(res, "Selamat Datang di API Perpustakaan Digital!", {
    status: "Server hidup!",
    message: `Halo pemilik API Key: ${req.apikey}!`,
    waktu_proses: `${waktu}ms`,
    endpoints: {
      books: [
        { path: "/api/books", method: "GET", description: "Menampilkan semua buku" },
        { path: "/api/books/:id", method: "GET", description: "Menampilkan buku berdasarkan ID" },
        { path: "/api/books/search", method: "GET", description: "Mencari buku" },
        { path: "/api/books", method: "POST", description: "Menambahkan buku baru" },
        { path: "/api/books/:id", method: "PUT", description: "Mengubah buku" },
        { path: "/api/books/:id", method: "DELETE", description: "Menghapus buku" },
      ],
      authors: [
        { path: "/api/authors", method: "GET", description: "Menampilkan semua author" },
        { path: "/api/authors/:id", method: "GET", description: "Menampilkan author berdasarkan ID" },
        { path: "/api/authors/search", method: "GET", description: "Mencari author" },
        { path: "/api/authors", method: "POST", description: "Menambahkan author baru" },
        { path: "/api/authors/:id", method: "PUT", description: "Mengubah author" },
        { path: "/api/authors/:id", method: "DELETE", description: "Menghapus author" },
      ],
      loans: [
        { path: "/api/loans", method: "GET", description: "Menampilkan semua peminjaman" },
        { path: "/api/loans/:id", method: "GET", description: "Menampilkan peminjaman berdasarkan ID" },
        { path: "/api/loans/search", method: "GET", description: "Mencari peminjaman" },
        { path: "/api/loans", method: "POST", description: "Membuat peminjaman baru" },
        { path: "/api/loans/:id", method: "PUT", description: "Mengubah peminjaman" },
        { path: "/api/loans/:id/return", method: "PATCH", description: "Mengembalikan buku" },
        { path: "/api/loans/:id", method: "DELETE", description: "Menghapus peminjaman" },
      ],
      members: [
        { path: "/api/members", method: "GET", description: "Menampilkan semua member" },
        { path: "/api/members/:id", method: "GET", description: "Menampilkan member berdasarkan ID" },
        { path: "/api/members/search", method: "GET", description: "Mencari member" },
        { path: "/api/members", method: "POST", description: "Menambahkan member baru" },
        { path: "/api/members/:id", method: "PUT", description: "Mengubah member" },
        { path: "/api/members/:id", method: "DELETE", description: "Menghapus member" },
      ],
      auth: "/api/auth",
    },
  });
});

// Register Routes
app.use("/api/books", bookRouter);
app.use("/api/authors", authorRouter);
app.use("/api/loans", loanRouter);
app.use("/api/members", memberRouter);
app.use("/api/auth", magicRouter);

// 404 Handler
app.use(/.*/, (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} tidak ditemukan`,
  });
});

// Error Handler (Centralized)
app.use(errorHandler);

export default app;