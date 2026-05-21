import config from "../config";
import { RUser } from "../types";
import jwt, { JwtPayload } from "jsonwebtoken";

export const verifyToken = (token: string, type: "access" | "refresh") => {
  const secret = type === "access" ? config.jwt_secret : config.refresh_secret;

  const decode = jwt.verify(token, secret);

  return decode as JwtPayload;
};

export const signToken = (payload: RUser) => {
  const accessToken = jwt.sign(payload, config.jwt_secret, {
    expiresIn: "2d",
  });
  const refreshToken = jwt.sign(payload, config.refresh_secret, {
    expiresIn: "30d",
  });

  return { accessToken, refreshToken };
};
