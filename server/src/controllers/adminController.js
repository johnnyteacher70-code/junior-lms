const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

exports.getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalCourses, totalEnrollments, students, teachers] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Enrollment.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'teacher' }),
    ]);
    res.json({ success: true, stats: { totalUsers, totalCourses, totalEnrollments, students, teachers } });
  } catch (err) { next(err); }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.json({ success: true, users });
  } catch (err) { next(err); }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['student', 'teacher', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot delete admin' });
    await user.deleteOne();
    res.json({ success: true, message: 'User deleted' });
  } catch (err) { next(err); }
};

exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate('instructor', 'name email').sort('-createdAt');
    res.json({ success: true, courses });
  } catch (err) { next(err); }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, message: 'Course deleted' });
  } catch (err) { next(err); }
};
