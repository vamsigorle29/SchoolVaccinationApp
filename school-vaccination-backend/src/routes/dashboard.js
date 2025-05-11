const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Drive = require("../models/VaccinationDrive");

// Get dashboard summary
router.get("/summary", async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const vaccinatedStudents = await Student.countDocuments({
      vaccinationStatus: "Fully Vaccinated"
    });
    const partiallyVaccinated = await Student.countDocuments({
      vaccinationStatus: "Partially Vaccinated"
    });
    const notVaccinated = await Student.countDocuments({
      vaccinationStatus: "Not Vaccinated"
    });

    const upcomingDrives = await Drive.find({
      date: { $gte: new Date() },
      status: "scheduled"
    }).sort({ date: 1 });

    res.json({
      success: true,
      data: {
        totalStudents,
        vaccinationStats: {
          fullyVaccinated: vaccinatedStudents,
          partiallyVaccinated,
          notVaccinated
        },
        upcomingDrives
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get grade-wise statistics
router.get("/grade-stats", async (req, res) => {
  try {
    const students = await Student.find();
    const gradeStats = {};

    students.forEach(student => {
      if (!gradeStats[student.grade]) {
        gradeStats[student.grade] = {
          total: 0,
          fullyVaccinated: 0,
          partiallyVaccinated: 0,
          notVaccinated: 0
        };
      }

      gradeStats[student.grade].total++;
      gradeStats[student.grade][student.vaccinationStatus.toLowerCase().replace(' ', '')]++;
    });

    res.json({
      success: true,
      data: gradeStats
    });
  } catch (error) {
    console.error("Error fetching grade stats:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router; 