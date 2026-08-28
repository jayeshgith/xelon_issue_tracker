import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import { decryptDeveloperPassword, encryptDeveloperPassword } from '../utils/developerCredential.js';
import { isStrongPassword, isValidEmail, isValidIndianPhone, normalizeEmail } from '../utils/validators.js';

const safeFields = 'firstName lastName email phone role isActive createdAt updatedAt';

export const listUsers = async () => User.find({ role: 'user' }).select(safeFields).sort({ createdAt: -1 });

export const listDevelopers = async () =>
  User.aggregate([
    { $match: { role: 'developer' } },
    { $lookup: { from: 'issues', localField: '_id', foreignField: 'assignedTo', as: 'issues' } },
    {
      $project: {
        firstName: 1, lastName: 1, email: 1, phone: 1, role: 1, isActive: 1, createdAt: 1, updatedAt: 1,
        assignedIssues: { $size: '$issues' },
        inProgress: { $size: { $filter: { input: '$issues', as: 'issue', cond: { $eq: ['$$issue.status', 'IN_PROGRESS'] } } } },
        closed: { $size: { $filter: { input: '$issues', as: 'issue', cond: { $eq: ['$$issue.status', 'CLOSED'] } } } }
      }
    },
    { $sort: { firstName: 1, lastName: 1 } }
  ]);

export const getDeveloperById = async (developerId) =>
  User.findOne({ _id: developerId, role: 'developer', isActive: true }).select(safeFields);

const validateDeveloper = ({ firstName, lastName, email, phone }) => {
  if (!firstName?.trim() || !lastName?.trim()) throw new ApiError(400, 'First and last name are required');
  if (!isValidEmail(email)) throw new ApiError(400, 'Valid email is required');
  if (!isValidIndianPhone(phone)) throw new ApiError(400, 'Phone number must use +91XXXXXXXXXX format');
};

export const createDeveloper = async (payload) => {
  validateDeveloper(payload);
  if (!isStrongPassword(payload.password) || payload.password !== payload.confirmPassword) {
    throw new ApiError(400, 'Password must be at least 8 characters with letters and numbers, and confirmation must match');
  }
  const email = normalizeEmail(payload.email);
  if (await User.findOne({ email })) throw new ApiError(409, 'Email already exists');
  const developer = new User({ firstName: payload.firstName.trim(), lastName: payload.lastName.trim(), email, phone: payload.phone.trim(), role: 'developer', isActive: true });
  await developer.setPassword(payload.password);
  developer.developerPasswordEncrypted = encryptDeveloperPassword(payload.password);
  await developer.save();
  return developer.toJSON();
};

export const updateDeveloper = async (developerId, payload) => {
  validateDeveloper(payload);
  const email = normalizeEmail(payload.email);
  const developer = await User.findOne({ _id: developerId, role: 'developer' }).select('+developerPasswordEncrypted');
  if (!developer) throw new ApiError(404, 'Developer not found');
  if (await User.findOne({ email, _id: { $ne: developerId } })) throw new ApiError(409, 'Email already exists');
  developer.firstName = payload.firstName.trim(); developer.lastName = payload.lastName.trim(); developer.email = email; developer.phone = payload.phone.trim();
  await developer.save();
  return developer.toJSON();
};

export const setDeveloperActive = async (developerId, isActive) => {
  const developer = await User.findOneAndUpdate({ _id: developerId, role: 'developer' }, { isActive: Boolean(isActive) }, { new: true }).select(safeFields);
  if (!developer) throw new ApiError(404, 'Developer not found');
  return developer;
};

export const getDeveloperCredential = async (developerId) => {
  const developer = await User.findOne({ _id: developerId, role: 'developer' }).select('+developerPasswordEncrypted firstName lastName email');
  if (!developer) throw new ApiError(404, 'Developer not found');
  if (!developer.developerPasswordEncrypted) throw new ApiError(404, 'Credential is unavailable for this developer');
  return { developer: developer.toJSON(), password: decryptDeveloperPassword(developer.developerPasswordEncrypted) };
};
