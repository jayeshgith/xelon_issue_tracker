import crypto from 'crypto';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { sendPasswordResetEmail } from '../utils/emailService.js';
import {
  isStrongPassword,
  isValidEmail,
  isValidIndianPhone,
  normalizeEmail
} from '../utils/validators.js';

const publicUserFields = 'firstName lastName email phone role isActive createdAt updatedAt';

const validateRegistration = ({ firstName, lastName, email, phone, password, confirmPassword }) => {
  if (!firstName?.trim()) {
    throw new ApiError(400, 'First name is required');
  }

  if (!lastName?.trim()) {
    throw new ApiError(400, 'Last name is required');
  }

  if (!isValidEmail(email)) {
    throw new ApiError(400, 'Valid email is required');
  }

  if (!isValidIndianPhone(phone)) {
    throw new ApiError(400, 'Phone number must use +91XXXXXXXXXX format');
  }

  if (!isStrongPassword(password)) {
    throw new ApiError(400, 'Password must be at least 8 characters and include letters and numbers');
  }

  if (password !== confirmPassword) {
    throw new ApiError(400, 'Confirm password must match password');
  }
};

export const registerUser = async (payload) => {
  validateRegistration(payload);

  const email = normalizeEmail(payload.email);
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, 'Email already exists');
  }

  const user = new User({
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    email,
    phone: payload.phone.trim(),
    role: 'user'
  });

  await user.setPassword(payload.password);
  await user.save();

  return {
    user,
    token: generateToken(user)
  };
};

export const loginUser = async ({ email, password }) => {
  if (!isValidEmail(email) || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email: normalizeEmail(email) }).select('+passwordHash');

  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'This account has been deactivated');
  }

  return {
    user,
    token: generateToken(user)
  };
};

export const getProfile = async (userId) => {
  const user = await User.findById(userId).select(publicUserFields);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
};

export const forgotPassword = async ({ email }) => {
  if (!isValidEmail(email)) {
    throw new ApiError(400, 'Valid email is required');
  }

  const user = await User.findOne({ email: normalizeEmail(email) });

  if (!user) {
    return;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetUrl = `${clientUrl.replace(/\/$/, '')}/reset-password?token=${resetToken}`;

  try {
    await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(500, 'Unable to send password reset email');
  }
};

export const resetPassword = async ({ token, password, confirmPassword }) => {
  if (!token) {
    throw new ApiError(400, 'Reset token is required');
  }

  if (!isStrongPassword(password)) {
    throw new ApiError(400, 'Password must be at least 8 characters and include letters and numbers');
  }

  if (password !== confirmPassword) {
    throw new ApiError(400, 'Confirm password must match password');
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() }
  });

  if (!user) {
    throw new ApiError(400, 'Invalid or expired reset token');
  }

  await user.setPassword(password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
};
