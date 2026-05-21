import config from "../config";
import { RUser } from "../types";
import jwt from "jsonwebtoken";
export const signToken = (payload: RUser) => {
  const accessToken = jwt.sign(payload, config.jwt_secret, {
    expiresIn: "2d",
  });
  const referenceToken = jwt.sign(payload, config.refresh_secret, {
    expiresIn: "7d",
  });

  return { accessToken, referenceToken };

  //* ReferenceToken
};
