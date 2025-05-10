const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parse');
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');
const { auth } = require('../middleware/auth');

// Configure multer for CSV upload
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

// Get all students with pagination and filters
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const classFilter = req.query.class || '';
    const vaccinationStatus = req.query.vaccinationStatus || '';

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }
    if (classFilter) {
      query.class = classFilter;
    }
    if (vaccinationStatus) {
      query['vaccinations.status'] = vaccinationStatus;
    }

    const students = await Student.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Student.countDocuments(query);

    res.json({
      success: true,
      data: students,
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

// Add a single student
router.post('/', auth, [
  body('studentId').trim().notEmpty().withMessage('Student ID is required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('class').trim().notEmpty().withMessage('Class is required'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Valid gender is required'),
  body('parentName').trim().notEmpty().withMessage('Parent name is required'),
  body('contactNumber').trim().notEmpty().withMessage('Contact number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const existingStudent = await Student.findOne({ studentId: req.body.studentId });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student ID already exists'
      });
    }

    const student = new Student(req.body);
    await student.save();

    res.status(201).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Bulk import students from CSV
router.post('/bulk-import', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const records = [];
    const parser = csv.parse({
      columns: true,
      skip_empty_lines: true
    });

    parser.on('readable', function() {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
    });

    parser.on('error', function(err) {
      return res.status(400).json({
        success: false,
        message: 'Error parsing CSV file'
      });
    });

    parser.on('end', async function() {
      try {
        const students = await Student.insertMany(records, { ordered: false });
        res.status(201).json({
          success: true,
          message: `${students.length} students imported successfully`
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: 'Error importing students',
          error: error.message
        });
      }
    });

    parser.write(req.file.buffer);
    parser.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update student vaccination status
router.patch('/:id/vaccination', auth, [
  body('vaccineName').trim().notEmpty().withMessage('Vaccine name is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('driveId').isMongoId().withMessage('Valid drive ID is required'),
  body('status').isIn(['scheduled', 'completed', 'missed']).withMessage('Valid status is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if student is already vaccinated for this vaccine
    const existingVaccination = student.vaccinations.find(
      v => v.vaccineName === req.body.vaccineName && v.status === 'completed'
    );

    if (existingVaccination) {
      return res.status(400).json({
        success: false,
        message: 'Student already vaccinated with this vaccine'
      });
    }

    student.vaccinations.push(req.body);
    await student.save();

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 