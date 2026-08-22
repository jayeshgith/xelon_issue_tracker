import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import {
  assignIssue as assignIssueService,
  createIssue as createIssueService,
  deleteIssue as deleteIssueService,
  getIssueById,
  listIssues as listIssuesService,
  updateIssue as updateIssueService
} from '../services/issueService.js';

export const listIssues = asyncHandler(async (req, res) => {
  const result = await listIssuesService(req.user, req.query);
  sendSuccess(res, 200, 'Issues loaded', { issues: result.items }, result.pagination);
});

export const getIssue = asyncHandler(async (req, res) => {
  const issue = await getIssueById(req.params.id, req.user);
  sendSuccess(res, 200, 'Issue loaded', { issue });
});

export const createIssue = asyncHandler(async (req, res) => {
  const issue = await createIssueService(req.body, req.user);
  sendSuccess(res, 201, 'Issue created successfully', { issue });
});

export const updateIssue = asyncHandler(async (req, res) => {
  const issue = await updateIssueService(req.params.id, req.body, req.user);
  sendSuccess(res, 200, 'Issue updated successfully', { issue });
});

export const assignIssue = asyncHandler(async (req, res) => {
  const issue = await assignIssueService(req.params.id, req.body.assignedTo, req.user);
  sendSuccess(res, 200, 'Issue assigned successfully', { issue });
});

export const deleteIssue = asyncHandler(async (req, res) => {
  await deleteIssueService(req.params.id, req.user);
  sendSuccess(res, 200, 'Issue deleted successfully');
});
