import { RUser } from ".";


declare global {
  namespace Express {
    interface Request {
      user: RUser;
    }
  }
}
