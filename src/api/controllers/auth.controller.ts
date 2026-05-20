import type { Request, Response } from "express";
import authService from "../services/auth.service";
import { sendResponse } from "../../utils/sendResponse";

export const signup = async (req: Request, res: Response) => {
  //   const { name, email, password, age, role } = ;

  const user = await authService.createUser(req.body);

  if (!user) {
    sendResponse(res, { message: "Failed To Create User" }, 400);
    return
  }

  sendResponse(res, { message: "User Created Successfully", data: user }, 201);
};
