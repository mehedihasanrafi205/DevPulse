import { Router } from "express";
import { login, refresh, signup } from "../controllers/auth.controller";

const router = Router();

router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.post("/auth/refresh", refresh);


export default router;
