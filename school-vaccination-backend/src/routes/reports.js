const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Drive = require('../models/VaccinationDrive');
const { auth } = require('../middleware/auth');

// Get overall vaccination statistics
router.get('/statistics', auth, async (req, res) => {
  try {
    // Get total students
    const totalStudents = await Student.countDocuments();

    // Get vaccinated students (students with at least one completed vaccination)
    const vaccinatedStudents = await Student.countDocuments({
      'vaccinations.status': 'completed'
    });

    // Get upcoming drives
    const upcomingDrives = await Drive.countDocuments({
      date: { $gte: new Date() },
      status: 'scheduled'
    });

    // Calculate vaccination rate
    const vaccinationRate = totalStudents > 0 
      ? Math.round((vaccinatedStudents / totalStudents) * 100) 
      : 0;

    res.json({
      totalStudents,
      vaccinatedStudents,
      upcomingDrives,
      vaccinationRate
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

// Get drive performance report
router.get('/drives', auth, async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;
    const query = {};

    if (dateFrom && dateTo) {
      query.date = {
        $gte: new Date(dateFrom),
        $lte: new Date(dateTo)
      };
    }

    const drives = await Drive.find(query)
      .sort({ date: 1 })
      .populate('coordinator', 'name');

    const driveStats = await Promise.all(
      drives.map(async (drive) => {
        const eligibleStudents = await Student.countDocuments({
          class: { $in: drive.applicableClasses }
        });

        const vaccinatedStudents = await Student.countDocuments({
          class: { $in: drive.applicableClasses },
          'vaccinations.driveId': drive._id,
          'vaccinations.status': 'completed'
        });

        return {
          ...drive.toObject(),
          eligibleStudents,
          vaccinatedStudents,
          vaccinationRate: eligibleStudents > 0 
            ? Math.round((vaccinatedStudents / eligibleStudents) * 100) 
            : 0
        };
      })
    );

    res.json({
      data: driveStats,
      total: driveStats.length
    });
  } catch (error) {
    console.error('Error fetching drive report:', error);
    res.status(500).json({ message: 'Error fetching drive report' });
  }
});

// Get student vaccination report
router.get('/students', auth, async (req, res) => {
  try {
    const { class: studentClass, status } = req.query;
    const query = {};

    if (studentClass) {
      query.class = studentClass;
    }

    if (status === 'vaccinated') {
      query['vaccinations.status'] = 'completed';
    } else if (status === 'unvaccinated') {
      query['vaccinations.status'] = { $ne: 'completed' };
    }

    const students = await Student.find(query)
      .sort({ name: 1 })
      .select('-__v');

    res.json({
      data: students,
      total: students.length
    });
  } catch (error) {
    console.error('Error fetching student report:', error);
    res.status(500).json({ message: 'Error fetching student report' });
  }
});

// Get upcoming vaccination schedule
router.get('/schedule', auth, async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;
    const query = {
      date: { $gte: new Date() },
      status: 'scheduled'
    };

    if (dateFrom && dateTo) {
      query.date = {
        $gte: new Date(dateFrom),
        $lte: new Date(dateTo)
      };
    }

    const drives = await Drive.find(query)
      .sort({ date: 1 })
      .populate('coordinator', 'name');

    const schedule = await Promise.all(
      drives.map(async (drive) => {
        const eligibleStudents = await Student.countDocuments({
          class: { $in: drive.applicableClasses }
        });

        return {
          ...drive.toObject(),
          eligibleStudents,
          availableDoses: drive.availableDoses
        };
      })
    );

    res.json({
      data: schedule,
      total: schedule.length
    });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ message: 'Error fetching schedule' });
  }
});

module.exports = router; 