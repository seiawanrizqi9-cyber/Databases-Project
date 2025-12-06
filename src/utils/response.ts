import type { Response } from "express";

interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
  search_result?: unknown;
  errors?: Array<{ field: string; message: string }>;
}

export const successResponse = (
  res: Response,
  message: string,
  data: unknown = null,
  statusCode: number = 200
) => {
  const response: ApiResponse = {
    success: true,
    message,
  };

  if (data !== null) {
    if (data && typeof data === "object" && "books" in (data as any)) {
      response.search_result = data;
    } else {
      response.data = data;
    }
  }

  return res.status(statusCode).json(response);
};

export const errorResponse = (
  res: Response,
  message: string,
  statusCode: number = 400,
  errors: Array<{ field: string; message: string }> |  null = null
) => {
  const response: ApiResponse = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};
