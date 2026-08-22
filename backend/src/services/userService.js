import User from '../models/User.js';

const safeFields = 'firstName lastName email phone role isActive createdAt updatedAt';

export const listUsers = async () => User.find({ role: 'user' }).select(safeFields).sort({ createdAt: -1 });

export const listDevelopers = async () =>
  User.find({ role: 'developer', isActive: true }).select(safeFields).sort({ firstName: 1, lastName: 1 });

export const getDeveloperById = async (developerId) =>
  User.findOne({ _id: developerId, role: 'developer', isActive: true }).select(safeFields);
