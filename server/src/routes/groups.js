const router = require('express').Router();
const {
  getGroups, getGroup, createGroup, updateGroup, deleteGroup,
  addStudent, removeStudent, getMyGroups, getMyGroup,
  getTeachers, getAvailableStudents,
} = require('../controllers/groupController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

// Exact/specific routes MUST come before param routes (/:id)
router.get('/teachers',      protect, authorize('admin'),              getTeachers);
router.get('/teacher/my',    protect, authorize('teacher'),            getMyGroups);
router.get('/student/my',    protect, authorize('student'),            getMyGroup);

// Admin CRUD
router.get('/',              protect, authorize('admin'),              getGroups);
router.post('/',             protect, authorize('admin'),              createGroup);
router.get('/:id',           protect, authorize('admin', 'teacher', 'student'), getGroup);
router.put('/:id',           protect, authorize('admin'),              updateGroup);
router.delete('/:id',        protect, authorize('admin'),              deleteGroup);
router.post('/:id/students', protect, authorize('admin'),              addStudent);
router.delete('/:id/students/:studentId', protect, authorize('admin'), removeStudent);
router.get('/:id/available-students',     protect, authorize('admin'), getAvailableStudents);

module.exports = router;
