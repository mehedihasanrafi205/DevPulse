import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import issuesService from "../services/issues.service";

export const createIssueController = async (req: Request, res: Response) => {
  const { title, description, type } = req.body || {};

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

export const getIssueByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const issueId = Number(id);
  if (isNaN(issueId)) {
    return sendResponse(res, { message: "Invalid issue ID format" }, 400);
  }

  const issue = await issuesService.getIssueById(issueId);

  if (!issue) {
    return sendResponse(res, { message: "Issue not found" }, 404);
  }

  sendResponse(
    res,
    {
      success: true,
      data: issue,
    } as any,
    200,
  );
};

export const updateIssueController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, type } = req.body;
  const issueId = Number(id);

  if (isNaN(issueId)) {
    return sendResponse(res, { message: "Invalid issue ID format" }, 400);
  }

  const issue = await issuesService.getRawIssueById(issueId);
  if (!issue) {
    return sendResponse(res, { message: "Issue not found" }, 404);
  }

  const currentUser = req.user as any;

  if (currentUser.role !== "maintainer") {
    if (issue.reporter_id !== currentUser.id) {
      return sendResponse(
        res,
        { message: "You do not have permission to edit this issue" },
        403,
      );
    }

    if (issue.status !== "open") {
      return sendResponse(
        res,
        {
          message:
            "Cannot edit an issue that is already in progress or resolved",
        },
        409,
      );
    }
  }

  if (title && title.length > 150) {
    return sendResponse(
      res,
      { message: "Title must be under 150 characters" },
      400,
    );
  }
  if (description && description.length < 20) {
    return sendResponse(
      res,
      { message: "Description must be at least 20 characters" },
      400,
    );
  }
  if (type && type !== "bug" && type !== "feature_request") {
    return sendResponse(
      res,
      { message: "Type must be either 'bug' or 'feature_request'" },
      400,
    );
  }

  const updatedIssue = await issuesService.updateIssue(issueId, {
    title,
    description,
    type,
  });

  sendResponse(
    res,
    {
      message: "Issue updated successfully",
      data: updatedIssue,
    },
    200,
  );
};

export const deleteIssueController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const issueId = Number(id);

  if (isNaN(issueId)) {
    return sendResponse(res, { message: "Invalid issue ID format" }, 400);
  }

  const isDeleted = await issuesService.deleteIssue(issueId);

  if (!isDeleted) {
    return sendResponse(res, { message: "Issue not found" }, 404);
  }

  sendResponse(
    res,
    {
      message: "Issue deleted successfully",
    },
    200,
  );
};
