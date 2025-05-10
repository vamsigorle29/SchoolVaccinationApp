const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Drive = require("../models/Drive");

// Get dashboard summary
router.get("/summary", async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const vaccinatedStudents = await Student.countDocuments({
      vaccinationStatus: "fully-vaccinated",
    });
    const upcomingDrives = await Drive.countDocuments({
      date: { $gte: new Date() },
    });
    const vaccinationRate = totalStudents > 0 ? (vaccinatedStudents / totalStudents) * 100 : 0;

    res.json({
      success: true,
      data: {
        totalStudents,
        vaccinatedStudents,
        upcomingDrives,
        vaccinationRate: Math.round(vaccinationRate * 100) / 100
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// Get today's drives
router.get("/today-drives", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const drives = await Drive.find({
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    }).populate("students");

    res.json({
      success: true,
      data: drives
    });
  } catch (error) {
    console.error("Error fetching today's drives:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router; 