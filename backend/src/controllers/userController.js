import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { createDeveloper as createDeveloperService, getDeveloperCredential as getCredentialService, listDevelopers, listUsers, setDeveloperActive, updateDeveloper as updateDeveloperService } from '../services/userService.js';

export const getUsers = asyncHandler(async (_req, res) => {
  const users = await listUsers();
  sendSuccess(res, 200, 'Users loaded', { users });
});

export const getDevelopers = asyncHandler(async (_req, res) => {
  const developers = await listDevelopers();
  sendSuccess(res, 200, 'Developers loaded', { developers });
});

export const createDeveloper = asyncHandler(async (req, res) => sendSuccess(res, 201, 'Developer created successfully', { developer: await createDeveloperService(req.body) }));
export const updateDeveloper = asyncHandler(async (req, res) => sendSuccess(res, 200, 'Developer updated successfully', { developer: await updateDeveloperService(req.params.id, req.body) }));
export const updateDeveloperStatus = asyncHandler(async (req, res) => sendSuccess(res, 200, 'Developer status updated successfully', { developer: await setDeveloperActive(req.params.id, req.body.isActive) }));
export const getDeveloperCredential = asyncHandler(async (req, res) => sendSuccess(res, 200, 'Developer credential loaded', await getCredentialService(req.params.id)));
