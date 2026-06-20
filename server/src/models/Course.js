const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  price: { type: Number, default: 0 },
  category: { type: String, required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  rating: { type: Number, default: 0 },
  totalStudents: { type: Number, default: 0 },
  duration: { type: String, default: '0h' },
  language: { type: String, default: 'English' },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
