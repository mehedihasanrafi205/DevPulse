import type { Request, Response } from "express";
import authService from "../services/auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { signToken } from "../../utils/jwt";

export const signup = async (req: Request, res: Response) => {
  const user = await authService.createUser(req.body);

  if (!user) {
    sendResponse(res, { message: "Failed To Create User" }, 400);
    return;
  }

  sendResponse(res, { message: "User Created Successfully", data: user }, 201);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await authService.validateUser(email, password);

  if (!user) {
    sendResponse(res, { message: "Invalid Credentials" }, 401);
    return;
  }

  const { accessToken, referenceToken } = signToken(user);

  res.cookie("refreshToken", referenceToken, {
    secure: false,
    httpOnly: true,
    sameSite: "lax",
  });

  const result = {
    user: user,
    accessToken,
    referenceToken,
  };

  return sendResponse(res, {
    message: "User Logging Successful!",
    data: result,
  });
};
