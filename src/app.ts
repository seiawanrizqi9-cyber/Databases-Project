import express, {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "./middleware/error.handler.js";
import { successResponse } from "./utils/response.js";
import bookRouter from "./routes/book.route.js";
import magicRouter from "./routes/magic.route.js";

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// API Key middleware - FIXED
app.use((req: Request, res: Response, next: NextFunction) => {
  req.startTime = Date.now();
  const apiKey = req.headers["x-api-key"] as string;
  
  if (!apiKey) {
    return res.status(401).json({ 
      success: false, 
      message: "Kirim header X-API-Key" 
    });
  }
  
  // Validate API key
  if (apiKey !== "katasandi123") {
    return res.status(401).json({ 
      success: false, 
      message: "API Key tidak valid!" 
    });
  }
  
  req.apikey = apiKey;
  next();
});

// Home endpoint
app.get("/", (req: Request, res: Response) => {
  const waktu = Date.now() - (req.startTime || 0);
  successResponse(res, "Selamat Datang di API Perpustakaan Digital!", {
    status: "Server hidup!",
    message: `Halo pemilik API Key: ${req.apikey}! Hari 5 - MVC E-Commerce + Service`,
    waktu_proses: `${waktu}ms`,
    endpoints: {
      books: [
        {
          path: "/api/books",
          method: "GET",
          description: "Menampilkan semua buku",
        },
        {
          path: "/api/books/:id",
          method: "GET",
          description: "Menampilkan buku berdasarkan ID",
        },
        {
          path: "/api/books/search",
          method: "GET",
          description: "Mencari buku",
        },
        {
          path: "/api/books",
          method: "POST",
          description: "Menambahkan buku baru",
        },
        { path: "/api/books/:id", method: "PUT", description: "Mengubah buku" },
        {
          path: "/api/books/:id",
          method: "DELETE",
          description: "Menghapus buku",
        },
      ],
      auth: [
        {
          path: "/api/auth/request",
          method: "POST",
          description: "Request magic link login",
        },
        {
          path: "/api/auth/verify",
          method: "POST",
          description: "Verify magic token",
        },
        {
          path: "/api/auth/validate",
          method: "GET",
          description: "Validate session",
        },
        {
          path: "/api/auth/users",
          method: "GET",
          description: "Get all users (admin)",
        },
        {
          path: "/api/auth/profile/:email",
          method: "GET",
          description: "Get user profile",
        },
        {
          path: "/api/auth/profile/:email",
          method: "PUT",
          description: "Update user profile",
        },
        {
          path: "/api/auth/logout",
          method: "POST",
          description: "Logout (optional)",
        },
      ],
    },
  });
});

// Routes
app.use("/api/books", bookRouter);
app.use("/api/auth", magicRouter);

// 404 handler
app.use(/.*/, (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} tidak ditemukan`,
  });
});

// Error handler
app.use(errorHandler);

export default app;