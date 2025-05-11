import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
  Plus, 
  Upload, 
  Search, 
  Edit, 
  Trash2, 
  Filter,
  ChevronDown,
  ChevronRight,
  Download,
  FileText,
  Users,
  GraduationCap,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  CheckCircle
} from "lucide-react";
import API_ENDPOINTS from "../../config/api";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [csvPreview, setCsvPreview] = useState(null);
  const [csvError, setCsvError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    class: "",
    dateOfBirth: "",
    gender: "",
    parentName: "",
    contactNumber: "",
    vaccinationStatus: "not-vaccinated",
    vaccinationHistory: []
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.STUDENTS.LIST);
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setStudents(response.data.data);
      } else if (Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        console.error("Unexpected response format:", response.data);
        setStudents([]);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to fetch students");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        const response = await axios.patch(API_ENDPOINTS.STUDENTS.UPDATE(editingStudent._id), formData);
        toast.success(response.data.message || "Student updated successfully");
      } else {
        await axios.post(API_ENDPOINTS.STUDENTS.CREATE, formData);
        toast.success("Student added successfully");
      }
      setShowAddModal(false);
      setEditingStudent(null);
      fetchStudents();
      setFormData({
        studentId: "",
        name: "",
        class: "",
        dateOfBirth: "",
        gender: "",
        parentName: "",
        contactNumber: "",
        vaccinationStatus: "not-vaccinated",
        vaccinationHistory: []
      });
    } catch (error) {
      console.error("Error saving student:", error);
      toast.error(editingStudent ? "Failed to update student" : "Failed to add student");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(API_ENDPOINTS.STUDENTS.DELETE(id));
        toast.success("Student deleted successfully");
        fetchStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
        toast.error("Failed to delete student");
      }
    }
  };

  const validateCsvData = (data) => {
    const requiredFields = ['studentId', 'name', 'class', 'dateOfBirth', 'gender', 'parentName', 'contactNumber'];
    const errors = [];

    data.forEach((row, index) => {
      requiredFields.forEach(field => {
        if (!row[field]) {
          errors.push(`Row ${index + 1}: Missing ${field}`);
        }
      });

      // Validate date format
      if (row.dateOfBirth && !isValidDate(row.dateOfBirth)) {
        errors.push(`Row ${index + 1}: Invalid date format for dateOfBirth`);
      }

      // Validate gender
      if (row.gender && !['male', 'female', 'other'].includes(row.gender.toLowerCase())) {
        errors.push(`Row ${index + 1}: Invalid gender value`);
      }

      // Validate class format (e.g., 1A, 2B, etc.)
      if (row.class && !/^[1-5][A-B]$/.test(row.class)) {
        errors.push(`Row ${index + 1}: Invalid class format (should be like 1A, 2B, etc.)`);
      }
    });

    return errors;
  };

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCsvError(null);
    setCsvPreview(null);

    // Check file type
    if (!file.name.endsWith('.csv')) {
      setCsvError('Please upload a CSV file');
      return;
    }

    try {
      const text = await file.text();
      const rows = text.split('\n');
      const headers = rows[0].split(',').map(h => h.trim());
      
      // Validate headers
      const requiredHeaders = ['studentId', 'name', 'class', 'dateOfBirth', 'gender', 'parentName', 'contactNumber'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        setCsvError(`Missing required columns: ${missingHeaders.join(', ')}`);
        return;
      }
      
      // Parse CSV data
      const data = rows.slice(1)
        .filter(row => row.trim()) // Remove empty rows
        .map((row, index) => {
          const values = row.split(',').map(v => v.trim());
          const student = headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
          }, {});
          
          // Validate required fields
          const missingFields = requiredHeaders.filter(field => !student[field]);
          if (missingFields.length > 0) {
            throw new Error(`Row ${index + 1}: Missing required fields: ${missingFields.join(', ')}`);
          }

          // Validate date format
          if (!isValidDate(student.dateOfBirth)) {
            throw new Error(`Row ${index + 1}: Invalid date format for dateOfBirth`);
          }

          // Validate gender
          if (!['male', 'female', 'other'].includes(student.gender.toLowerCase())) {
            throw new Error(`Row ${index + 1}: Invalid gender value. Must be male, female, or other`);
          }

          // Validate class format
          if (!/^[1-5][A-B]$/.test(student.class)) {
            throw new Error(`Row ${index + 1}: Invalid class format. Must be like 1A, 2B, etc.`);
          }

          // Add default values
          return {
            ...student,
            vaccinationStatus: 'not-vaccinated',
            vaccinationHistory: []
          };
        });

      // Show preview
      setCsvPreview(data);
    } catch (error) {
      console.error('Error reading CSV:', error);
      setCsvError(error.message || 'Error reading CSV file');
    }
  };

  const handleCsvUpload = async () => {
    if (!csvPreview) return;

    try {
      setUploading(true);
      const response = await axios.post(API_ENDPOINTS.STUDENTS.BULK_CREATE, csvPreview);
      
      if (response.data && response.data.inserted) {
        toast.success(`Successfully uploaded ${response.data.inserted} students`);
        setCsvPreview(null);
        fetchStudents();
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error uploading students:', error);
      toast.error(error.response?.data?.error || error.response?.data?.details || 'Failed to upload students');
    } finally {
      setUploading(false);
    }
  };

  const filteredStudents = Array.isArray(students) ? students.filter(student => {
    if (!student) return false;
    const matchesSearch = student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === "all" || student.class === selectedClass;
    const matchesStatus = selectedStatus === "all" || 
                         (selectedStatus === "vaccinated" && student.vaccinations?.length > 0) ||
                         (selectedStatus === "unvaccinated" && (!student.vaccinations || student.vaccinations.length === 0));
    return matchesSearch && matchesClass && matchesStatus;
  }) : [];

  const totalStudents = Array.isArray(students) ? students.length : 0;
  const vaccinatedStudents = Array.isArray(students) ? students.filter(s => s?.vaccinations?.length > 0).length : 0;
  const unvaccinatedStudents = Array.isArray(students) ? students.filter(s => !s?.vaccinations || s.vaccinations.length === 0).length : 0;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Student Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and track student vaccination records
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Student
          </button>
          <label className="btn btn-outline flex items-center gap-2 cursor-pointer">
            <Upload className="h-4 w-4" />
            Upload CSV
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-800">{totalStudents}</h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vaccinated Students</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-800">{vaccinatedStudents}</h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unvaccinated Students</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-800">{unvaccinatedStudents}</h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                className="input pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              className="input"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="all">All Classes</option>
              <option value="1">Class 1</option>
              <option value="2">Class 2</option>
              <option value="3">Class 3</option>
              <option value="4">Class 4</option>
              <option value="5">Class 5</option>
              <option value="6">Class 6</option>
              <option value="7">Class 7</option>
              <option value="8">Class 8</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
            </select>
            <select
              className="input"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="vaccinated">Vaccinated</option>
              <option value="unvaccinated">Unvaccinated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent Info
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vaccination Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Vaccination
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">ID: {student.studentId}</div>
                        <div className="text-xs text-gray-400 capitalize">{student.gender}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.class}</div>
                    <div className="text-xs text-gray-500">
                      DOB: {new Date(student.dateOfBirth).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.parentName}</div>
                    <div className="text-sm text-gray-500">{student.contactNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      student.vaccinationStatus === 'fully-vaccinated' 
                        ? "bg-green-100 text-green-800"
                        : student.vaccinationStatus === 'partially-vaccinated'
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {student.vaccinationStatus === 'fully-vaccinated' ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Fully Vaccinated
                        </>
                      ) : student.vaccinationStatus === 'partially-vaccinated' ? (
                        <>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Partially Vaccinated
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Not Vaccinated
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.vaccinationHistory?.length > 0 ? (
                        <>
                          <div>{student.vaccinationHistory[student.vaccinationHistory.length - 1].vaccineName}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(student.vaccinationHistory[student.vaccinationHistory.length - 1].date).toLocaleDateString()}
                          </div>
                        </>
                      ) : (
                        "No vaccinations"
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingStudent(student);
                        setFormData(student);
                        setShowAddModal(true);
                      }}
                      className="text-primary hover:text-primary-dark mr-4"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(student._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="glass-card p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingStudent ? "Edit Student" : "Add New Student"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Student ID</label>
                  <input
                    type="text"
                    className="input mt-1 w-full"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    className="input mt-1 w-full"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Class</label>
                  <select
                    className="input mt-1 w-full"
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    required
                  >
                    <option value="">Select Class</option>
                    <option value="1A">Class 1A</option>
                    <option value="1B">Class 1B</option>
                    <option value="2A">Class 2A</option>
                    <option value="2B">Class 2B</option>
                    <option value="3A">Class 3A</option>
                    <option value="3B">Class 3B</option>
                    <option value="4A">Class 4A</option>
                    <option value="4B">Class 4B</option>
                    <option value="5A">Class 5A</option>
                    <option value="5B">Class 5B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    className="input mt-1 w-full"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  className="input mt-1 w-full"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Parent Name</label>
                  <input
                    type="text"
                    className="input mt-1 w-full"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                  <input
                    type="tel"
                    className="input mt-1 w-full"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingStudent(null);
                    setFormData({
                      studentId: "",
                      name: "",
                      class: "",
                      dateOfBirth: "",
                      gender: "",
                      parentName: "",
                      contactNumber: "",
                      vaccinationStatus: "not-vaccinated",
                      vaccinationHistory: []
                    });
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingStudent ? "Update" : "Add"} Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Preview Modal */}
      {csvPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="glass-card p-6 w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">CSV Preview ({csvPreview.length} students)</h2>
              <button
                onClick={() => setCsvPreview(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="overflow-x-auto mb-4 max-h-[60vh]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    {Object.keys(csvPreview[0]).map(header => (
                      <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {csvPreview.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, i) => (
                        <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setCsvPreview(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCsvUpload}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Upload {csvPreview.length} Students
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
