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
    const adminSecret = process.env.ADMIN_SECRET || 'junior-admin-2026';
    const teacherSecret = process.env.TEACHER_SECRET || 'junior-teacher-2026';
    let safeRole = 'student';
    if (role === 'teacher' && req.body.teacherCode === teacherSecret) safeRole = 'teacher';
    else if (role === 'teacher') return res.status(403).json({ success: false, message: "O'qituvchi kodi noto'g'ri" });
    if (role === 'admin' && req.body.adminCode === adminSecret) safeRole = 'admin';
    else if (role === 'admin') return res.status(403).json({ success: false, message: 'Admin kodi noto\'g\'ri' });
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

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar } = req.body;
    const allowed = {};
    if (name) allowed.name = name.trim();
    if (bio !== undefined) allowed.bio = bio;
    if (avatar !== undefined) allowed.avatar = avatar;
    const user = await User.findByIdAndUpdate(req.user._id, allowed, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Joriy va yangi parolni kiriting' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Yangi parol kamida 6 ta belgi bo\'lishi kerak' });
    }
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Joriy parol noto\'g\'ri' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Parol muvaffaqiyatli o\'zgartirildi' });
  } catch (err) { next(err); }
};
