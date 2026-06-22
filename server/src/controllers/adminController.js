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

exports.getUserDetail = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });

    if (user.role === 'student') {
      const enrollments = await Enrollment.find({ student: user._id })
        .populate({ path: 'course', select: 'title thumbnail category level price status' })
        .sort('-enrolledAt');
      return res.json({ success: true, user, enrollments });
    }

    if (user.role === 'teacher') {
      const courses = await Course.find({ instructor: user._id })
        .select('title thumbnail category level status totalStudents createdAt')
        .sort('-createdAt');
      const Lesson = require('../models/Lesson');
      const courseIds = courses.map(c => c._id);
      const lessonCount = await Lesson.countDocuments({ course: { $in: courseIds } });
      const totalStudents = courses.reduce((sum, c) => sum + c.totalStudents, 0);
      return res.json({ success: true, user, courses, lessonCount, totalStudents });
    }

    res.json({ success: true, user });
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
    if (!['student', 'teacher'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Faqat student yoki teacher roliga o\'tkazish mumkin' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'O\'z rolingizni o\'zgartira olmaysiz' });
    }
    user.role = role;
    await user.save();
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
