import Issue from "../models/Issue.js";
import User from "../models/User.js";

const issueStats = async (filter) => {
  const [total, open, inProgress, closed, highPriority] = await Promise.all([
    Issue.countDocuments(filter),
    Issue.countDocuments({ ...filter, status: "OPEN" }),
    Issue.countDocuments({ ...filter, status: "IN_PROGRESS" }),
    Issue.countDocuments({ ...filter, status: "CLOSED" }),
    Issue.countDocuments({ ...filter, priority: "HIGH" }),
  ]);

  return {
    total,
    open,
    inProgress,
    closed,
    highPriority,
  };
};

const recentIssues = async (filter) =>
  Issue.find(filter)
    .sort({ updatedAt: -1 })
    .limit(6)
    .populate("category", "name")
    .populate("createdBy", "firstName lastName email role")
    .populate("assignedTo", "firstName lastName email role");

const groupedCounts = async (filter, field) => {
  const results = await Issue.aggregate([
    { $match: filter },
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
    { $project: { _id: 0, name: "$_id", count: 1 } },
    { $sort: { count: -1, name: 1 } },
  ]);

  return results;
};

const issueTrend = async (filter) => {
  const results = await Issue.aggregate([
    { $match: filter },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        created: { $sum: 1 },
      },
    },
    { $project: { _id: 0, date: "$_id", created: 1 } },
    { $sort: { date: 1 } },
  ]);

  return results;
};

const categoryCounts = async () => {
  const results = await Issue.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    { $unwind: "$categoryDetails" },
    {
      $group: {
        _id: "$categoryDetails._id",
        name: { $first: "$categoryDetails.name" },
        count: { $sum: 1 },
      },
    },
    { $project: { _id: 0, name: 1, count: 1 } },
    { $sort: { count: -1, name: 1 } },
  ]);

  return results;
};

const developerWorkload = async () => {
  const results = await Issue.aggregate([
    { $match: { assignedTo: { $ne: null } } },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "developer",
      },
    },
    { $unwind: "$developer" },
    { $match: { "developer.role": "developer" } },
    {
      $group: {
        _id: "$assignedTo",
        name: {
          $first: {
            $concat: ["$developer.firstName", " ", "$developer.lastName"],
          },
        },
        assigned: { $sum: 1 },
        open: { $sum: { $cond: [{ $eq: ["$status", "OPEN"] }, 1, 0] } },
        inProgress: {
          $sum: { $cond: [{ $eq: ["$status", "IN_PROGRESS"] }, 1, 0] },
        },
        closed: { $sum: { $cond: [{ $eq: ["$status", "CLOSED"] }, 1, 0] } },
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        assigned: 1,
        open: 1,
        inProgress: 1,
        closed: 1,
      },
    },
    { $sort: { assigned: -1, name: 1 } },
  ]);

  return results;
};

const dashboardData = async (filter) => {
  const [stats, recent, status, priorities, trend] = await Promise.all([
    issueStats(filter),
    recentIssues(filter),
    groupedCounts(filter, "status"),
    groupedCounts(filter, "priority"),
    issueTrend(filter),
  ]);

  return {
    stats,
    trend,
    recentIssues: recent,
    charts: {
      status,
      priorities,
    },
  };
};

export const getUserDashboard = async (user) => {
  const filter = { createdBy: user._id };
  return dashboardData(filter);
};

export const getDeveloperDashboard = async (user) => {
  const filter = { assignedTo: user._id };
  return dashboardData(filter);
};

export const getAdminDashboard = async () => {
  const [dashboard, totalUsers, totalDevelopers, categories, developers] =
    await Promise.all([
      dashboardData({}),
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "developer" }),
      categoryCounts(),
      developerWorkload(),
    ]);

  return {
    ...dashboard,
    totalUsers,
    totalDevelopers,
    charts: {
      ...dashboard.charts,
      categories,
      developers,
    },
  };
};
