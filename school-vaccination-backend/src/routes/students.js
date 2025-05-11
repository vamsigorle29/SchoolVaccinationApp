const Student = require('../models/Student');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Get all students
router.get("/", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// Get single student
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new student
router.post("/", async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    const saved = await newStudent.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Failed to save student:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// Get enriched student data
router.get("/v2", async (req, res) => {
  try {
    const students = await Student.find();

    const enriched = students.map((s) => ({
      _id: s._id,
      rollNumber: s.rollNumber,
      name: s.name,
      class: s.class,
      vaccinations: s.vaccinations,
      vaccinesTaken: s.vaccinations.map((v) => v.vaccine),
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students v2" });
  }
});

// Bulk insert students
router.post("/bulk", async (req, res) => {
  try {
    const students = req.body;
    if (!Array.isArray(students)) {
      return res.status(400).json({ error: "Expected an array of students" });
    }

    const result = await Student.insertMany(students, { ordered: false });
    res.status(201).json({ inserted: result.length });
  } catch (err) {
    console.error("❌ Bulk insert error:", err.message);
    res.status(500).json({ error: "Bulk insert failed", details: err.message });
  }
});

// Update student
router.patch("/:id", async (req, res) => {
  try {
    const studentId = req.params.id;
    console.log("🔍 Attempting to update student with ID:", studentId);
    console.log("📝 Update data:", req.body);

    // First find the student to ensure it exists
    const existingStudent = await Student.findById(studentId);
    if (!existingStudent) {
      console.log("❌ Student not found with ID:", studentId);
      return res.status(404).json({
        success: false,
        error: "Student not found"
      });
    }

    // Prepare update data with only the fields that are provided
    const updateData = {};
    const allowedFields = ['name', 'class', 'dateOfBirth', 'gender', 'parentName', 'contactNumber', 'vaccinationStatus', 'vaccinationHistory'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Add updatedAt timestamp
    updateData.updatedAt = new Date();

    // Update the student
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { $set: updateData },
      { 
        new: true,
        runValidators: true,
        context: 'query'
      }
    );

    console.log("✅ Student updated successfully:", updatedStudent);
    res.json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent
    });
  } catch (err) {
    console.error("❌ Update error:", err.message);
    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: Object.values(err.errors).map(e => e.message)
      });
    }
    res.status(500).json({
      success: false,
      error: "Update failed",
      details: err.message
    });
  }
});

// Delete student
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Delete failed',
      error: err.message
    });
  }
});

module.exports = router;