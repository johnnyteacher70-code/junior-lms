require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lms');
  console.log('MongoDB connected');
};

const seed = async () => {
  await connectDB();
  const User = require('./src/models/User');

  const existing = await User.findOne({ email: 'admin@learnhub.com' });
  if (existing) {
    console.log('Admin already exists: admin@learnhub.com / admin123');
    process.exit(0);
  }

  await User.create({ name: 'Admin', email: 'admin@learnhub.com', password: 'admin123', role: 'admin' });
  console.log('✅ Admin created: admin@learnhub.com / admin123');
  process.exit(0);
};

seed().catch((e) => { console.error(e); process.exit(1); });
