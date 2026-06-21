const router = require('express').Router();
const { register, login, getMe, updateProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

// TEMP: admin yaratish uchun - ishlatgandan keyin o'chirish kerak
router.post('/setup-admin', async (req, res, next) => {
  try {
    const User = require('../models/User');
    const { secret, email, password, name } = req.body;
    if (secret !== 'junior-setup-2026') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    const exists = await User.findOne({ email });
    if (exists) {
      exists.role = 'admin';
      await exists.save();
      return res.json({ success: true, message: 'Role updated to admin', user: exists.email });
    }
    const user = await User.create({ name: name || 'Admin', email, password, role: 'admin' });
    res.json({ success: true, message: 'Admin created', user: user.email });
  } catch (err) { next(err); }
});

module.exports = router;
