import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Category from '../models/Category.js';
import User from '../models/User.js';

dotenv.config();

const createOrUpdateUser = async ({ firstName, lastName, email, phone, role, password }) => {
  let user = await User.findOne({ email });

  if (!user) {
    user = new User({
      firstName,
      lastName,
      email,
      phone,
      role,
      isActive: true
    });
  } else {
    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;
    user.role = role;
    user.isActive = true;
  }

  await user.setPassword(password);
  await user.save();
  return user;
};

const seed = async () => {
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new Error('SEED_ADMIN_PASSWORD is required');
  }

  await connectDB();

  const admin = await createOrUpdateUser({
    firstName: 'Xelon',
    lastName: 'Admin',
    email: process.env.SEED_ADMIN_EMAIL || 'admin@xelon.local',
    phone: '+919000000001',
    role: 'admin',
    password: adminPassword
  });

  const categoryNames = ['Web Development', 'App Development', 'Payment'];

  for (const name of categoryNames) {
    await Category.findOneAndUpdate(
      { name },
      { name, createdBy: admin._id, isActive: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log('Seed complete: admin, developers, and categories are ready');
};

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(`Seed failed: ${error.message}`);
    process.exit(1);
  });
