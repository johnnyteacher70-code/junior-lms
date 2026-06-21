const Group = require('../models/Group');
const User  = require('../models/User');

// Admin: barcha guruhlar
exports.getGroups = async (req, res, next) => {
  try {
    const groups = await Group.find()
      .populate('teacher', 'name email')
      .populate('students', 'name email')
      .populate('course', 'title')
      .sort({ createdAt: -1 });
    res.json({ success: true, groups });
  } catch (err) { next(err); }
};

// Bitta guruh
exports.getGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('teacher', 'name email')
      .populate('students', 'name email')
      .populate('course', 'title');
    if (!group) return res.status(404).json({ success: false, message: 'Guruh topilmadi' });
    res.json({ success: true, group });
  } catch (err) { next(err); }
};

// Admin: guruh yaratish
exports.createGroup = async (req, res, next) => {
  try {
    const group = await Group.create(req.body);
    res.status(201).json({ success: true, group });
  } catch (err) { next(err); }
};

// Admin: guruhni yangilash
exports.updateGroup = async (req, res, next) => {
  try {
    const group = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('teacher', 'name email')
      .populate('students', 'name email')
      .populate('course', 'title');
    if (!group) return res.status(404).json({ success: false, message: 'Guruh topilmadi' });
    res.json({ success: true, group });
  } catch (err) { next(err); }
};

// Admin: guruhni o'chirish
exports.deleteGroup = async (req, res, next) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Guruh topilmadi' });
    res.json({ success: true, message: 'Guruh o\'chirildi' });
  } catch (err) { next(err); }
};

// Admin: guruhga talaba qo'shish
exports.addStudent = async (req, res, next) => {
  try {
    const { studentId } = req.body;
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Guruh topilmadi' });
    if (group.students.includes(studentId))
      return res.status(400).json({ success: false, message: 'Talaba allaqachon guruhda' });
    group.students.push(studentId);
    await group.save();
    await group.populate('students', 'name email');
    await group.populate('teacher', 'name email');
    await group.populate('course', 'title');
    res.json({ success: true, group });
  } catch (err) { next(err); }
};

// Admin: guruhdan talaba chiqarish
exports.removeStudent = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Guruh topilmadi' });
    group.students = group.students.filter(s => s.toString() !== req.params.studentId);
    await group.save();
    res.json({ success: true, message: 'Talaba guruhdan chiqarildi' });
  } catch (err) { next(err); }
};

// O'qituvchi: o'z guruhlari
exports.getMyGroups = async (req, res, next) => {
  try {
    const groups = await Group.find({ teacher: req.user._id })
      .populate('students', 'name email')
      .populate('course', 'title')
      .sort({ createdAt: -1 });
    res.json({ success: true, groups });
  } catch (err) { next(err); }
};

// Talaba: o'z guruhi
exports.getMyGroup = async (req, res, next) => {
  try {
    const group = await Group.findOne({ students: req.user._id })
      .populate('teacher', 'name email')
      .populate('students', 'name email')
      .populate('course', 'title');
    res.json({ success: true, group: group || null });
  } catch (err) { next(err); }
};

// Barcha o'qituvchilar ro'yxati (admin uchun)
exports.getTeachers = async (req, res, next) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('name email');
    res.json({ success: true, teachers });
  } catch (err) { next(err); }
};

// Guruhga kiritilmagan talabalar (admin uchun)
exports.getAvailableStudents = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Guruh topilmadi' });
    const students = await User.find({
      role: 'student',
      _id: { $nin: group.students },
    }).select('name email');
    res.json({ success: true, students });
  } catch (err) { next(err); }
};
