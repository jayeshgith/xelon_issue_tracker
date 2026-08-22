import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { listDevelopers, listUsers } from '../services/userService.js';

export const getUsers = asyncHandler(async (_req, res) => {
  const users = await listUsers();
  sendSuccess(res, 200, 'Users loaded', { users });
});

export const getDevelopers = asyncHandler(async (_req, res) => {
  const developers = await listDevelopers();
  sendSuccess(res, 200, 'Developers loaded', { developers });
});
