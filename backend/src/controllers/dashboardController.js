import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import {
  getAdminDashboard as getAdminDashboardService,
  getDeveloperDashboard as getDeveloperDashboardService,
  getUserDashboard as getUserDashboardService
} from '../services/dashboardService.js';

export const getUserDashboard = asyncHandler(async (req, res) => {
  const dashboard = await getUserDashboardService(req.user);
  sendSuccess(res, 200, 'User dashboard loaded', dashboard);
});

export const getDeveloperDashboard = asyncHandler(async (req, res) => {
  const dashboard = await getDeveloperDashboardService(req.user);
  sendSuccess(res, 200, 'Developer dashboard loaded', dashboard);
});

export const getAdminDashboard = asyncHandler(async (_req, res) => {
  const dashboard = await getAdminDashboardService();
  sendSuccess(res, 200, 'Admin dashboard loaded', dashboard);
});
