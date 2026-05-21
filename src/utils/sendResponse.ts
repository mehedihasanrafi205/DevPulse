import type { Response } from "express";

export function sendResponse<T>(
  res: Response,
  { message, data, error }: { message: unknown; data?: T; error?: boolean },
  status = 200,
) {
  const isError = error !== undefined ? error : status >= 400;
  res.status(status).json({
    success: !isError,
    message: message,
    data: isError ? undefined : data,
  });
}