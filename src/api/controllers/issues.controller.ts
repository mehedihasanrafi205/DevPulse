import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import issuesService from "../services/issues.service";

export const createIssueController = async (req: Request, res: Response) => {
  const { title, description, type } = req.body;

  if (!title || title.length > 150) {
    return sendResponse(
      res,
      { message: "Title is required and must be under 150 characters" },
      400,
    );
  }

  if (type !== "bug" && type !== "feature_request") {
    return sendResponse(
      res,
      { message: "Type must be either 'bug' or 'feature_request'" },
      400,
    );
  }

  const reporter_id = (req.user as any).id;

  const newIssue = await issuesService.createIssue({
    title,
    description,
    type,
    reporter_id,
  });
  if (!newIssue) {
    return sendResponse(res, { message: "Failed to create issue" }, 500);
  }

  sendResponse(
    res,
    {
      message: "Issue created successfully",
      data: newIssue,
    },
    201,
  );
};

export const getAllIssuesController = async (req: Request, res: Response) => {
  const { sort, type, status } = req.query;

  const issues = await issuesService.getAllIssues({
    sort: sort as string,
    type: type as string,
    status: status as string,
  });

  sendResponse(
    res,
    {
      success: true,
      data: issues,
    } as any,
    200,
  );
};
