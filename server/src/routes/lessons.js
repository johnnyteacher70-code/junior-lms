const router = require('express').Router({ mergeParams: true });
const { getLessons, createLesson, updateLesson, deleteLesson } = require('../controllers/lessonController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

router.get('/', getLessons);
router.post('/', protect, authorize('teacher', 'admin'), createLesson);
router.put('/:id', protect, authorize('teacher', 'admin'), updateLesson);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteLesson);

module.exports = router;
