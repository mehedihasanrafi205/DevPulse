import { Router } from "express";
import { login, refresh, signup } from "../controllers/auth.controller";
import { auth, authorizeRole } from "../../middleware/auth";
import { createIssueController } from "../controllers/issues.controller";

const router = Router();

router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.post("/auth/refresh", refresh);

router.post("/issues", auth, createIssueController);
router.get("/issues", auth, () => {});
router.get("/issues/:id", auth, () => {});
router.patch("/issues/:id", auth, () => {});
router.delete("/issues/:id", authorizeRole("maintainer"), () => {});

export default router;
