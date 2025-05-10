const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Drive = require('../models/Drive');
const { auth, adminOnly } = require('../middleware/auth');

// Get all drives with pagination and filters
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || '';
    const dateFrom = req.query.dateFrom || '';
    const dateTo = req.query.dateTo || '';

    const query = {};
    if (status) {
      query.status = status;
    }
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) query.date.$gte = new Date(dateFrom);
      if (dateTo) query.date.$lte = new Date(dateTo);
    }

    const drives = await Drive.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ date: 1 });

    const total = await Drive.countDocuments(query);

    res.json({
      success: true,
      data: drives,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Create a new drive
router.post('/', [auth, adminOnly], [
  body('vaccineName').trim().notEmpty().withMessage('Vaccine name is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('availableDoses').isInt({ min: 1 }).withMessage('Available doses must be at least 1'),
  body('applicableClasses').isArray().withMessage('Applicable classes must be an array'),
  body('applicableClasses.*').trim().notEmpty().withMessage('Class name cannot be empty'),
  body('coordinator').trim().notEmpty().withMessage('Coordinator name is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Check for scheduling conflicts
    const conflicts = await Drive.checkConflicts(
      req.body.date,
      req.body.applicableClasses
    );

    if (conflicts.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Scheduling conflict detected',
        conflicts
      });
    }

    const drive = new Drive({
      ...req.body,
      status: 'scheduled'
    });

    await drive.save();

    res.status(201).json({
      success: true,
      data: drive
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update drive status
router.patch('/:id/status', [auth, adminOnly], [
  body('status').isIn(['scheduled', 'in-progress', 'completed', 'cancelled'])
    .withMessage('Valid status is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const drive = await Drive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({
        success: false,
        message: 'Drive not found'
      });
    }

    // Validate status transition
    const validTransitions = {
      'scheduled': ['in-progress', 'cancelled'],
      'in-progress': ['completed', 'cancelled'],
      'completed': [],
      'cancelled': []
    };

    if (!validTransitions[drive.status].includes(req.body.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition from ${drive.status} to ${req.body.status}`
      });
    }

    drive.status = req.body.status;
    await drive.save();

    res.json({
      success: true,
      data: drive
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update drive details
router.patch('/:id', [auth, adminOnly], [
  body('vaccineName').optional().trim().notEmpty().withMessage('Vaccine name cannot be empty'),
  body('date').optional().isISO8601().withMessage('Valid date is required'),
  body('availableDoses').optional().isInt({ min: 1 }).withMessage('Available doses must be at least 1'),
  body('applicableClasses').optional().isArray().withMessage('Applicable classes must be an array'),
  body('applicableClasses.*').optional().trim().notEmpty().withMessage('Class name cannot be empty'),
  body('coordinator').optional().trim().notEmpty().withMessage('Coordinator name cannot be empty'),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const drive = await Drive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({
        success: false,
        message: 'Drive not found'
      });
    }

    // If date or applicable classes are being updated, check for conflicts
    if (req.body.date || req.body.applicableClasses) {
      const conflicts = await Drive.checkConflicts(
        req.body.date || drive.date,
        req.body.applicableClasses || drive.applicableClasses,
        drive._id // Exclude current drive from conflict check
      );

      if (conflicts.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Scheduling conflict detected',
          conflicts
        });
      }
    }

    Object.assign(drive, req.body);
    await drive.save();

    res.json({
      success: true,
      data: drive
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get drive statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const totalDrives = await Drive.countDocuments();
    const upcomingDrives = await Drive.countDocuments({
      date: { $gte: new Date() },
      status: 'scheduled'
    });
    const completedDrives = await Drive.countDocuments({ status: 'completed' });
    const cancelledDrives = await Drive.countDocuments({ status: 'cancelled' });

    res.json({
      success: true,
      data: {
        total: totalDrives,
        upcoming: upcomingDrives,
        completed: completedDrives,
        cancelled: cancelledDrives
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 