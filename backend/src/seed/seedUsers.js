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
  const developerPassword = process.env.SEED_DEVELOPER_PASSWORD;

  if (!adminPassword || !developerPassword) {
    throw new Error('SEED_ADMIN_PASSWORD and SEED_DEVELOPER_PASSWORD are required');
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

  const developers = [
    ['Developer', 'One', 'developer1@xelon.local', '+919000000011'],
    ['Developer', 'Two', 'developer2@xelon.local', '+919000000012'],
    ['Developer', 'Three', 'developer3@xelon.local', '+919000000013'],
    ['Developer', 'Four', 'developer4@xelon.local', '+919000000014']
  ];

  for (const [firstName, lastName, email, phone] of developers) {
    await createOrUpdateUser({
      firstName,
      lastName,
      email,
      phone,
      role: 'developer',
      password: developerPassword
    });
  }

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
