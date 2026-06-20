const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

const ensureOwner = async (courseId, userId, role) => {
  const course = await Course.findById(courseId);
  if (!course) return { error: 'Course not found', status: 404 };
  if (course.instructor.toString() !== userId.toString() && role !== 'admin') {
    return { error: 'Not authorized', status: 403 };
  }
  return { course };
};

exports.getLessons = async (req, res, next) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId }).sort('order');
    res.json({ success: true, lessons });
  } catch (err) { next(err); }
};

exports.createLesson = async (req, res, next) => {
  try {
    const { error, status } = await ensureOwner(req.params.courseId, req.user._id, req.user.role);
    if (error) return res.status(status).json({ success: false, message: error });
    const lesson = await Lesson.create({ ...req.body, course: req.params.courseId });
    res.status(201).json({ success: true, lesson });
  } catch (err) { next(err); }
};

exports.updateLesson = async (req, res, next) => {
  try {
    let lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });
    const { error, status } = await ensureOwner(lesson.course, req.user._id, req.user.role);
    if (error) return res.status(status).json({ success: false, message: error });
    lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, lesson });
  } catch (err) { next(err); }
};

exports.deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });
    const { error, status } = await ensureOwner(lesson.course, req.user._id, req.user.role);
    if (error) return res.status(status).json({ success: false, message: error });
    await lesson.deleteOne();
    res.json({ success: true, message: 'Lesson deleted' });
  } catch (err) { next(err); }
};
