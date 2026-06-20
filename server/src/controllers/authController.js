const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const sendToken = (user, statusCode, res) => {
  const token = generateToken(user._id);
  const u = user.toObject();
  delete u.password;
  res.status(statusCode).json({ success: true, token, user: u });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });
    const safeRole = ['student', 'teacher'].includes(role) ? role : 'student';
    const user = await User.create({ name, email, password, role: safeRole });
    sendToken(user, 201, res);
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Provide email and password' });
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    sendToken(user, 200, res);
  } catch (err) { next(err); }
};

exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};
