const router = require('express').Router();
const { getStats, getUsers, getUserDetail, updateUserRole, deleteUser, getCourses, deleteCourse } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');

router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/users/:id', getUserDetail);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/courses', getCourses);
router.delete('/courses/:id', deleteCourse);

module.exports = router;
