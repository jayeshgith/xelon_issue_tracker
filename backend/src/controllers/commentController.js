import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import {
  createComment as createCommentService,
  deleteComment as deleteCommentService,
  listComments as listCommentsService
} from '../services/commentService.js';

export const listComments = asyncHandler(async (req, res) => {
  const comments = await listCommentsService(req.params.issueId, req.user);
  sendSuccess(res, 200, 'Comments loaded', { comments });
});

export const createComment = asyncHandler(async (req, res) => {
  const comment = await createCommentService(req.params.issueId, req.user, req.body.text);
  sendSuccess(res, 201, 'Comment added successfully', { comment });
});

export const deleteComment = asyncHandler(async (req, res) => {
  await deleteCommentService(req.params.id, req.user);
  sendSuccess(res, 200, 'Comment deleted successfully');
});
