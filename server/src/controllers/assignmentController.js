const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Course = require('../models/Course');

const ensureOwner = async (courseId, userId, role) => {
  const course = await Course.findById(courseId);
  if (!course) return { error: 'Course not found', status: 404 };
  if (course.instructor.toString() !== userId.toString() && role !== 'admin') {
    return { error: 'Not authorized', status: 403 };
  }
  return { course };
};

exports.getAssignments = async (req, res, next) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId });
    res.json({ success: true, assignments });
  } catch (err) { next(err); }
};

exports.createAssignment = async (req, res, next) => {
  try {
    const { error, status } = await ensureOwner(req.params.courseId, req.user._id, req.user.role);
    if (error) return res.status(status).json({ success: false, message: error });
    const assignment = await Assignment.create({ ...req.body, course: req.params.courseId });
    res.status(201).json({ success: true, assignment });
  } catch (err) { next(err); }
};

exports.updateAssignment = async (req, res, next) => {
  try {
    let assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });
    const { error, status } = await ensureOwner(assignment.course, req.user._id, req.user.role);
    if (error) return res.status(status).json({ success: false, message: error });
    assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, assignment });
  } catch (err) { next(err); }
};

exports.deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });
    const { error, status } = await ensureOwner(assignment.course, req.user._id, req.user.role);
    if (error) return res.status(status).json({ success: false, message: error });
    await assignment.deleteOne();
    res.json({ success: true, message: 'Assignment deleted' });
  } catch (err) { next(err); }
};

exports.submitAssignment = async (req, res, next) => {
  try {
    const existing = await Submission.findOne({ assignment: req.params.id, student: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: 'Already submitted' });
    const submission = await Submission.create({
      assignment: req.params.id, student: req.user._id, content: req.body.content,
    });
    res.status(201).json({ success: true, submission });
  } catch (err) { next(err); }
};

exports.getSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ assignment: req.params.id }).populate('student', 'name email avatar');
    res.json({ success: true, submissions });
  } catch (err) { next(err); }
};

exports.gradeSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { grade: req.body.grade, feedback: req.body.feedback },
      { new: true }
    );
    if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });
    res.json({ success: true, submission });
  } catch (err) { next(err); }
};

exports.getMySubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ student: req.user._id }).populate('assignment', 'title points dueDate course');
    res.json({ success: true, submissions });
  } catch (err) { next(err); }
};
