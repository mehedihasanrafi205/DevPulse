import type { Response } from "express";

export function sendResponse<T>(
  res: Response,
  { message, data, errors }: { message?: unknown | undefined; data?: T | undefined; errors?: unknown | undefined },
  status = 200,
) {
  const isError = status >= 400;

  const response: any = {
    success: !isError,
  };

  if (message !== undefined) {
    response.message = message;
  }

  if (isError) {
    response.errors = errors !== undefined ? errors : message;
  } else {
    if (data !== undefined) {
      response.data = data;
    }
  }

  res.status(status).json(response);
}