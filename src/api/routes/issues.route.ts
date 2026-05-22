import { Router } from "express";
import { auth, authorizeRole } from "../../middleware/auth";
import {
  createIssueController,
  getAllIssuesController,
  getIssueByIdController,
  updateIssueController,
  deleteIssueController,
} from "../controllers/issues.controller";

const router = Router();

router.post("/", auth, createIssueController);
router.get("/", getAllIssuesController); 
router.get("/:id", getIssueByIdController); 
router.patch("/:id", auth, updateIssueController);
router.delete("/:id", auth, authorizeRole("maintainer"), deleteIssueController);

export default router;
