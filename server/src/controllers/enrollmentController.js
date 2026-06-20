const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

exports.enroll = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    if (course.status !== 'published') return res.status(400).json({ success: false, message: 'Course not published' });
    const exists = await Enrollment.findOne({ student: req.user._id, course: req.params.courseId });
    if (exists) return res.status(400).json({ success: false, message: 'Already enrolled' });
    const enrollment = await Enrollment.create({ student: req.user._id, course: req.params.courseId });
    await Course.findByIdAndUpdate(req.params.courseId, { $inc: { totalStudents: 1 } });
    res.status(201).json({ success: true, enrollment });
  } catch (err) { next(err); }
};

exports.getMyCourses = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({ path: 'course', populate: { path: 'instructor', select: 'name avatar' } });
    res.json({ success: true, enrollments });
  } catch (err) { next(err); }
};

exports.updateProgress = async (req, res, next) => {
  try {
    const { lessonId } = req.body;
    const enrollment = await Enrollment.findOne({ student: req.user._id, course: req.params.courseId });
    if (!enrollment) return res.status(404).json({ success: false, message: 'Not enrolled' });
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }
    const totalLessons = await Lesson.countDocuments({ course: req.params.courseId });
    enrollment.progress = totalLessons > 0
      ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
      : 0;
    await enrollment.save();
    res.json({ success: true, enrollment });
  } catch (err) { next(err); }
};

exports.checkEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({ student: req.user._id, course: req.params.courseId });
    res.json({ success: true, enrolled: !!enrollment, enrollment });
  } catch (err) { next(err); }
};
