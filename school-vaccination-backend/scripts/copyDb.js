const mongoose = require('mongoose');
const Student = require('../src/models/Student');
const VaccinationDrive = require('../src/models/VaccinationDrive');
require('dotenv').config();

const SOURCE_DB = 'mongodb+srv://srilakshmikalaga:23101998@cluster0.kyjazba.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';
const TARGET_DB = 'mongodb+srv://srilakshmikalaga:23101998@cluster0.kyjazba.mongodb.net/school-vaccination?retryWrites=true&w=majority&appName=Cluster0';

async function copyDatabase() {
  try {
    console.log('🔄 Starting database copy process...');
    
    // Connect to source database
    console.log('📡 Connecting to source database...');
    await mongoose.connect(SOURCE_DB);
    console.log('✅ Connected to source database');

    // Fetch all data
    console.log('📥 Fetching data from source database...');
    const students = await Student.find({});
    const drives = await VaccinationDrive.find({});
    console.log(`✅ Fetched ${students.length} students and ${drives.length} drives`);

    // Transform student data to match new schema
    const transformedStudents = students.map(student => ({
      studentId: student.rollNumber || student.studentId || `STU${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      name: student.name || 'Unknown',
      class: student.class || '1A',
      dateOfBirth: student.dateOfBirth || new Date('2000-01-01'),
      gender: student.gender || 'other',
      parentName: student.parentName || 'Not Specified',
      contactNumber: student.contactNumber || 'Not Specified',
      vaccinationStatus: student.vaccinationStatus || 'not-vaccinated',
      vaccinationHistory: student.vaccinationHistory || (student.vaccinations ? student.vaccinations.map(v => ({
        vaccineName: v.vaccine || 'Unknown',
        date: v.date || new Date(),
        doseNumber: 1,
        driveId: null
      })) : [])
    }));

    // Disconnect from source
    await mongoose.disconnect();
    console.log('✅ Disconnected from source database');

    // Connect to target database
    console.log('📡 Connecting to target database...');
    await mongoose.connect(TARGET_DB);
    console.log('✅ Connected to target database');

    // Clear existing data
    console.log('🧹 Clearing existing data in target database...');
    await Student.deleteMany({});
    await VaccinationDrive.deleteMany({});
    console.log('✅ Cleared existing data');

    // Insert data
    console.log('📤 Inserting data into target database...');
    if (transformedStudents.length > 0) {
      await Student.insertMany(transformedStudents);
      console.log(`✅ Inserted ${transformedStudents.length} students`);
    }
    if (drives.length > 0) {
      await VaccinationDrive.insertMany(drives);
      console.log(`✅ Inserted ${drives.length} drives`);
    }

    console.log('✅ Database copy completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error copying database:', error);
    process.exit(1);
  }
}

copyDatabase(); 