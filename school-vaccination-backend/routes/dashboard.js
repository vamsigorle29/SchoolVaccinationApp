const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Drive = require("../models/VaccinationDrive");

router.get("/summary", async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const vaccinatedStudents = await Student.countDocuments({ "vaccinations.0": { $exists: true } });
    const upcomingDrives = await Drive.countDocuments({
      date: { $gte: new Date() }
    });

    res.json({
      totalStudents,
      vaccinated: vaccinatedStudents,
      unvaccinated: totalStudents - vaccinatedStudents,
      upcomingDrives
    });
  } catch (err) {
    res.status(500).json({ error: "Dashboard summary failed." });
  }
});

module.exports = router;
