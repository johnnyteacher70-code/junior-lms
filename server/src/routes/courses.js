const router = require('express').Router();
const {
  getCourses, getCourse, createCourse, updateCourse,
  deleteCourse, publishCourse, getTeacherCourses,
} = require('../controllers/courseController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const lessonRoutes = require('./lessons');
const assignmentRoutes = require('./assignments');

router.use('/:courseId/lessons', lessonRoutes);
router.use('/:courseId/assignments', assignmentRoutes);

router.get('/', getCourses);
router.get('/my', protect, authorize('teacher'), getTeacherCourses);
router.get('/:id', getCourse);
router.post('/', protect, authorize('teacher', 'admin'), createCourse);
router.put('/:id', protect, authorize('teacher', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteCourse);
router.patch('/:id/publish', protect, authorize('teacher'), publishCourse);

module.exports = router;
