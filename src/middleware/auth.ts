import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import { verifyToken } from "../utils/jwt";
import authService from "../api/services/auth.service";
import { Role, RUser } from "../types";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    return sendResponse(res, { message: "Token not found" }, 401);
  }

  const payload = verifyToken(token, "access");

  if (!payload) {
    return sendResponse(res, { message: "Invalid Token" }, 401);
  }

  const user = await authService.getUserById(payload.id);
  if (!user) {
    return sendResponse(res, { message: "User not found" }, 401);
  }

  req.user = user;
  next();
};

export const authorizeRole = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const currentUser = req.user as RUser | undefined;

    if (!currentUser) {
      return sendResponse(res, { message: "You are not authenticated" }, 401);
    }

    if (!roles.includes(currentUser.role)) {
      return sendResponse(
        res,
        { message: "You do not have permission to access this resource" },
        403,
      );
    }
    return next();
  };
};
