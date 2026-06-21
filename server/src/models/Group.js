const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  teacher:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  students:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  course:      { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null },
  status:      { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);
