import { Router } from 'express';
import { createComment, deleteComment, listComments } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

export const issueCommentRouter = Router({ mergeParams: true });

issueCommentRouter.use(protect);
issueCommentRouter.route('/').get(listComments).post(createComment);

export const commentRouter = Router();

commentRouter.use(protect);
commentRouter.delete('/:id', deleteComment);
