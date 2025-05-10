const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema({
  vaccineName: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  availableDoses: {
    type: Number,
    required: true,
    min: 0
  },
  applicableClasses: [{
    type: String,
    required: true,
    trim: true
  }],
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  coordinator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  vaccinatedCount: {
    type: Number,
    default: 0,
  },
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
driveSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Validate that the drive date is at least 15 days in advance
driveSchema.pre('save', function(next) {
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 15);
  
  if (this.date < minDate) {
    next(new Error('Vaccination drive must be scheduled at least 15 days in advance'));
  }
  next();
});

// Static method to check for scheduling conflicts
driveSchema.statics.checkConflicts = async function(date, applicableClasses) {
  const existingDrive = await this.findOne({
    date: {
      $gte: new Date(date.setHours(0, 0, 0, 0)),
      $lt: new Date(date.setHours(23, 59, 59, 999))
    },
    applicableClasses: { $in: applicableClasses },
    status: { $ne: 'cancelled' }
  });
  
  return existingDrive;
};

module.exports = mongoose.model('Drive', driveSchema); 