const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  class: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  parentName: {
    type: String,
    required: true,
    trim: true
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true
  },
  vaccinationStatus: {
    type: String,
    enum: ["not-vaccinated", "partially-vaccinated", "fully-vaccinated"],
    default: "not-vaccinated",
  },
  vaccinationHistory: [{
    vaccineName: String,
    date: Date,
    doseNumber: Number,
    driveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drive",
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
});

// Update the updatedAt timestamp before saving
studentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Student', studentSchema); 