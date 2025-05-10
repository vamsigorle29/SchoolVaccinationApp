const express = require("express");
const router = express.Router();
const Drive = require("../models/VaccinationDrive");

// Existing: GET /api/drives

// ✅ New: GET today's drives
router.get("/today", async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // start of today (local)

  try {
    const drives = await Drive.find({
      date: { $gte: today } // only check lower bound for now
    });
    res.json(drives);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch today's drives" });
  }
});
router.get("/", async (req, res) => {
  const drives = await Drive.find();
  res.json(drives);
});

router.post("/", async (req, res) => {
  try {
    const { vaccine, date, totalDoses, applicableClasses } = req.body;

    const newDrive = new Drive({
      vaccine,
      date,
      totalDoses,
      applicableClasses,
    });

    const saved = await newDrive.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Failed to add drive:", err.message);
    res.status(400).json({ error: err.message });
  }
});




module.exports = router;
