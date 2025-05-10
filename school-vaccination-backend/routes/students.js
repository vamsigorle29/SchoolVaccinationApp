const Student = require('../models/Student');
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
router.get('/test',studentController.test )

router.get("/", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

module.exports = router;
