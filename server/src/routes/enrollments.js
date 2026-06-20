const router = require('express').Router();
const { enroll, getMyCourses, updateProgress, checkEnrollment } = require('../controllers/enrollmentController');
const { gradeSubmission, getMySubmissions } = require('../controllers/assignmentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

router.get('/my-courses', protect, authorize('student'), getMyCourses);
router.get('/my-submissions', protect, authorize('student'), getMySubmissions);
router.get('/:courseId/check', protect, checkEnrollment);
router.post('/:courseId', protect, authorize('student'), enroll);
router.patch('/:courseId/progress', protect, authorize('student'), updateProgress);
router.patch('/submissions/:id/grade', protect, authorize('teacher', 'admin'), gradeSubmission);

module.exports = router;
