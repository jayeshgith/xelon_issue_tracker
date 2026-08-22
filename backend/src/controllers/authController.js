import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import {
  forgotPassword,
  getProfile,
  loginUser,
  registerUser,
  resetPassword
} from '../services/authService.js';

export const register = asyncHandler(async (req, res) => {
  const data = await registerUser(req.body);
  sendSuccess(res, 201, 'Registration successful', data);
});

export const login = asyncHandler(async (req, res) => {
  const data = await loginUser(req.body);
  sendSuccess(res, 200, 'Login successful', data);
});

export const me = asyncHandler(async (req, res) => {
  const user = await getProfile(req.user._id);
  sendSuccess(res, 200, 'Profile loaded', { user });
});

export const requestPasswordReset = asyncHandler(async (req, res) => {
  await forgotPassword(req.body);
  sendSuccess(res, 200, 'If the email exists, a password reset link has been sent');
});

export const completePasswordReset = asyncHandler(async (req, res) => {
  await resetPassword(req.body);
  sendSuccess(res, 200, 'Password reset successful');
});
