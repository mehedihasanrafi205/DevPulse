import { Router } from "express";
import { login, signup } from "../controllers/auth.controller";

const router = Router();

router.post("/auth/signup", signup);
router.post("/auth/login", login);

router.post("/issues", () => {});
router.get("/issues", () => {});
router.patch("/issues", () => {});
router.delete("/issues/:id", () => {});

export default router;
