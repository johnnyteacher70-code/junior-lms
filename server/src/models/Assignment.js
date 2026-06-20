const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  dueDate: { type: Date },
  points: { type: Number, default: 100 },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
