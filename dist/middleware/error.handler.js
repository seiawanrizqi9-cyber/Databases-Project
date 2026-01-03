import { Prisma } from "../generated/client";
import { errorResponse } from "../utils/response.js";
export const errorHandler = (err, _req, res, _next) => {
    console.error("ERROR:", err.message);
    // Handle Prisma Errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002":
                return errorResponse(res, "Data sudah ada (Unique constraint violation)", 400);
            case "P2025":
                return errorResponse(res, "Data tidak ditemukan", 404);
            case "P2003":
                return errorResponse(res, "Foreign key constraint failed", 400);
            default:
                return errorResponse(res, `Database error: ${err.message}`, 500);
        }
    }
    // Handle Prisma Validation Errors
    if (err instanceof Prisma.PrismaClientValidationError) {
        return errorResponse(res, "Validasi database gagal", 400);
    }
    // Handle custom errors
    const statusCode = err.message.includes("tidak ditemukan") ? 404 : 400;
    return errorResponse(res, err.message || "Terjadi kesalahan server", statusCode);
};
//# sourceMappingURL=error.handler.js.map
