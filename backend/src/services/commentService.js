import ApiError from '../utils/ApiError.js';
import Comment from '../models/Comment.js';
import { getIssueById } from './issueService.js';

const populateComment = (query) => query.populate('user', 'firstName lastName email role');

export const listComments = async (issueIdentifier, user) => {
  const issue = await getIssueById(issueIdentifier, user);
  return populateComment(Comment.find({ issue: issue._id }).sort({ createdAt: 1 }));
};

export const createComment = async (issueIdentifier, user, text) => {
  const cleanText = String(text || '').trim();

  if (!cleanText) {
    throw new ApiError(400, 'Comment text is required');
  }

  const issue = await getIssueById(issueIdentifier, user);
  const comment = await Comment.create({
    issue: issue._id,
    user: user._id,
    text: cleanText
  });

  return populateComment(Comment.findById(comment._id));
};

export const deleteComment = async (commentId, user) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, 'Comment not found');
  }

  const isAuthor = String(comment.user) === String(user._id);

  if (user.role !== 'admin' && !isAuthor) {
    throw new ApiError(403, 'You can delete only your own comments');
  }

  await Comment.deleteOne({ _id: comment._id });
};
