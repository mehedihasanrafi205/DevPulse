import { Router } from "express";
import {
  deleteIssueController,
  login,
  refresh,
  signup,
} from "../controllers/auth.controller";
import { auth, authorizeRole } from "../../middleware/auth";
import {
  createIssueController,
  getAllIssuesController,
  getIssueByIdController,
  updateIssueController,
} from "../controllers/issues.controller";

const router = Router();

router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.post("/auth/refresh", refresh);

router.post("/issues", auth, createIssueController);
router.get("/issues", auth, getAllIssuesController);
router.get("/issues/:id", auth, getIssueByIdController);
router.patch("/issues/:id", auth, updateIssueController);
router.delete(
  "/issues/:id",
  auth,
  authorizeRole("maintainer"),
  deleteIssueController,
);

export default router;
