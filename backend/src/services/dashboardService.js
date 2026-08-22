import Issue from '../models/Issue.js';
import User from '../models/User.js';

const issueStats = async (filter) => {
  const [total, open, inProgress, closed, highPriority] = await Promise.all([
    Issue.countDocuments(filter),
    Issue.countDocuments({ ...filter, status: 'OPEN' }),
    Issue.countDocuments({ ...filter, status: 'IN_PROGRESS' }),
    Issue.countDocuments({ ...filter, status: 'CLOSED' }),
    Issue.countDocuments({ ...filter, priority: 'HIGH' })
  ]);

  return {
    total,
    open,
    inProgress,
    closed,
    highPriority
  };
};

const recentIssues = async (filter) =>
  Issue.find(filter)
    .sort({ updatedAt: -1 })
    .limit(6)
    .populate('category', 'name')
    .populate('createdBy', 'firstName lastName email role')
    .populate('assignedTo', 'firstName lastName email role');

export const getUserDashboard = async (user) => {
  const filter = { createdBy: user._id };
  const [stats, recent] = await Promise.all([issueStats(filter), recentIssues(filter)]);

  return {
    stats,
    recentIssues: recent
  };
};

export const getDeveloperDashboard = async (user) => {
  const filter = { assignedTo: user._id };
  const [stats, recent] = await Promise.all([issueStats(filter), recentIssues(filter)]);

  return {
    stats,
    recentIssues: recent
  };
};

export const getAdminDashboard = async () => {
  const [stats, recent, totalUsers, totalDevelopers] = await Promise.all([
    issueStats({}),
    recentIssues({}),
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'developer' })
  ]);

  return {
    stats,
    totalUsers,
    totalDevelopers,
    recentIssues: recent
  };
};
