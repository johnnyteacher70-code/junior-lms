const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

exports.getCourses = async (req, res, next) => {
  try {
    const { category, level, search, status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    else filter.status = 'published';
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) filter.title = { $regex: search, $options: 'i' };
    const courses = await Course.find(filter).populate('instructor', 'name avatar');
    res.json({ success: true, courses });
  } catch (err) { next(err); }
};

exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name avatar bio');
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, course });
  } catch (err) { next(err); }
};

exports.createCourse = async (req, res, next) => {
  try {
    const course = await Course.create({ ...req.body, instructor: req.user._id });
    res.status(201).json({ success: true, course });
  } catch (err) { next(err); }
};

exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, course });
  } catch (err) { next(err); }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await course.deleteOne();
    res.json({ success: true, message: 'Course deleted' });
  } catch (err) { next(err); }
};

exports.publishCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    course.status = course.status === 'published' ? 'draft' : 'published';
    await course.save();
    res.json({ success: true, course });
  } catch (err) { next(err); }
};

exports.getTeacherCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructor: req.user._id });
    res.json({ success: true, courses });
  } catch (err) { next(err); }
};
