import mongoose from 'mongoose';
import ApiError from '../utils/ApiError.js';
import Comment from '../models/Comment.js';
import Issue from '../models/Issue.js';
import User from '../models/User.js';
import generateIssueId from '../utils/generateIssueId.js';
import { getActiveCategory } from './categoryService.js';

const allowedPriorities = ['LOW', 'MEDIUM', 'HIGH'];
const allowedStatuses = ['OPEN', 'IN_PROGRESS', 'CLOSED'];

const populateIssue = (query) =>
  query
    .populate('category', 'name isActive')
    .populate('createdBy', 'firstName lastName email role')
    .populate('assignedTo', 'firstName lastName email role');

const getRoleFilter = (user) => {
  if (user.role === 'admin') {
    return {};
  }

  if (user.role === 'developer') {
    return { assignedTo: user._id };
  }

  return { createdBy: user._id };
};

const canAccessIssue = (issue, user) => {
  if (user.role === 'admin') {
    return true;
  }

  if (user.role === 'developer') {
    return String(issue.assignedTo?._id || issue.assignedTo) === String(user._id);
  }

  return String(issue.createdBy?._id || issue.createdBy) === String(user._id);
};

const findIssueByIdentifier = async (identifier) => {
  const filters = [{ issueId: String(identifier || '').toUpperCase() }];

  if (mongoose.isValidObjectId(identifier)) {
    filters.push({ _id: identifier });
  }

  const issue = await populateIssue(Issue.findOne({ $or: filters }));

  if (!issue) {
    throw new ApiError(404, 'Issue not found');
  }

  return issue;
};

const validatePriority = (priority) => {
  if (priority && !allowedPriorities.includes(priority)) {
    throw new ApiError(400, 'Invalid priority');
  }
};

const validateStatus = (status) => {
  if (status && !allowedStatuses.includes(status)) {
    throw new ApiError(400, 'Invalid status');
  }
};

const ensureDeveloper = async (developerId) => {
  const developer = await User.findOne({ _id: developerId, role: 'developer', isActive: true });

  if (!developer) {
    throw new ApiError(400, 'Assigned user must be an active developer');
  }

  return developer;
};

export const listIssues = async (user, query = {}) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 50);
  const skip = (page - 1) * limit;
  const filter = getRoleFilter(user);

  if (query.search) {
    const searchRegex = new RegExp(String(query.search).trim(), 'i');
    filter.$or = [{ issueId: searchRegex }, { title: searchRegex }, { description: searchRegex }];
  }

  if (query.status) {
    validateStatus(query.status);
    filter.status = query.status;
  }

  if (query.priority) {
    validatePriority(query.priority);
    filter.priority = query.priority;
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.developer && user.role === 'admin') {
    filter.assignedTo = query.developer;
  }

  const [items, total] = await Promise.all([
    populateIssue(Issue.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit)),
    Issue.countDocuments(filter)
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1
    }
  };
};

export const getIssueById = async (identifier, user) => {
  const issue = await findIssueByIdentifier(identifier);

  if (!canAccessIssue(issue, user)) {
    throw new ApiError(403, 'You do not have access to this issue');
  }

  return issue;
};

export const createIssue = async (payload, user) => {
  if (!payload.title?.trim()) {
    throw new ApiError(400, 'Issue title is required');
  }

  if (!payload.description?.trim()) {
    throw new ApiError(400, 'Issue description is required');
  }

  validatePriority(payload.priority);
  const category = await getActiveCategory(payload.category);

  const issue = await Issue.create({
    issueId: await generateIssueId(),
    title: payload.title.trim(),
    description: payload.description.trim(),
    category: category._id,
    priority: payload.priority || 'MEDIUM',
    status: 'OPEN',
    createdBy: user._id
  });

  return getIssueById(issue._id, user);
};

export const updateIssue = async (identifier, payload, user) => {
  const issue = await findIssueByIdentifier(identifier);

  if (!canAccessIssue(issue, user)) {
    throw new ApiError(403, 'You do not have access to this issue');
  }

  if (user.role === 'user') {
    if (issue.status !== 'OPEN' || issue.assignedTo) {
      throw new ApiError(403, 'Only open unassigned issues can be edited by the reporter');
    }

    if (payload.title !== undefined) {
      issue.title = String(payload.title || '').trim();
    }

    if (payload.description !== undefined) {
      issue.description = String(payload.description || '').trim();
    }

    if (payload.category !== undefined) {
      const category = await getActiveCategory(payload.category);
      issue.category = category._id;
    }

    if (payload.priority !== undefined) {
      validatePriority(payload.priority);
      issue.priority = payload.priority;
    }
  }

  if (user.role === 'admin') {
    if (payload.title !== undefined) {
      issue.title = String(payload.title || '').trim();
    }

    if (payload.description !== undefined) {
      issue.description = String(payload.description || '').trim();
    }

    if (payload.category !== undefined) {
      const category = await getActiveCategory(payload.category);
      issue.category = category._id;
    }

    if (payload.priority !== undefined) {
      validatePriority(payload.priority);
      issue.priority = payload.priority;
    }

    if (payload.status !== undefined) {
      validateStatus(payload.status);
      issue.status = payload.status;
    }

    if (payload.assignedTo !== undefined) {
      if (payload.assignedTo) {
        const developer = await ensureDeveloper(payload.assignedTo);
        issue.assignedTo = developer._id;

        if (issue.status === 'OPEN') {
          issue.status = 'IN_PROGRESS';
        }
      } else {
        issue.assignedTo = null;
      }
    }
  }

  if (user.role === 'developer') {
    if (payload.status === undefined) {
      throw new ApiError(400, 'Developers can update issue status only');
    }

    validateStatus(payload.status);

    if (payload.status === 'OPEN') {
      throw new ApiError(400, 'Developers cannot move assigned issues back to OPEN');
    }

    issue.status = payload.status;
  }

  await issue.save();
  return getIssueById(issue._id, user);
};

export const assignIssue = async (identifier, developerId, user) => {
  if (user.role !== 'admin') {
    throw new ApiError(403, 'Only admins can assign issues');
  }

  const issue = await findIssueByIdentifier(identifier);
  const developer = await ensureDeveloper(developerId);

  issue.assignedTo = developer._id;

  if (issue.status === 'OPEN') {
    issue.status = 'IN_PROGRESS';
  }

  await issue.save();
  return getIssueById(issue._id, user);
};

export const deleteIssue = async (identifier, user) => {
  const issue = await findIssueByIdentifier(identifier);

  if (user.role === 'developer') {
    throw new ApiError(403, 'Developers cannot delete issues');
  }

  if (user.role === 'user') {
    const ownsIssue = String(issue.createdBy?._id || issue.createdBy) === String(user._id);

    if (!ownsIssue || issue.status !== 'OPEN' || issue.assignedTo) {
      throw new ApiError(403, 'Only your own open unassigned issues can be deleted');
    }
  }

  await Comment.deleteMany({ issue: issue._id });
  await Issue.deleteOne({ _id: issue._id });
};
