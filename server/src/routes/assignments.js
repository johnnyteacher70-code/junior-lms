const router = require('express').Router({ mergeParams: true });
const {
  getAssignments, createAssignment, updateAssignment, deleteAssignment,
  submitAssignment, getSubmissions, gradeSubmission, getMySubmissions,
} = require('../controllers/assignmentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

router.get('/', protect, getAssignments);
router.post('/', protect, authorize('teacher', 'admin'), createAssignment);
router.put('/:id', protect, authorize('teacher', 'admin'), updateAssignment);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteAssignment);
router.post('/:id/submit', protect, authorize('student'), submitAssignment);
router.get('/:id/submissions', protect, authorize('teacher', 'admin'), getSubmissions);

module.exports = router;
