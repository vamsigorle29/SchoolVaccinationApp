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
  AlertCircle
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
  const [formData, setFormData] = useState({
    rollNumber: "",
    name: "",
    class: "",
    vaccinations: [],
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.STUDENTS.LIST);
      setStudents(response.data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await axios.put(API_ENDPOINTS.STUDENTS.UPDATE(editingStudent._id), formData);
        toast.success("Student updated successfully");
      } else {
        await axios.post(API_ENDPOINTS.STUDENTS.CREATE, formData);
        toast.success("Student added successfully");
      }
      setShowAddModal(false);
      setEditingStudent(null);
      fetchStudents();
      setFormData({
        rollNumber: "",
        name: "",
        class: "",
        vaccinations: [],
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        await axios.post(API_ENDPOINTS.STUDENTS.UPLOAD, formData);
        toast.success("Students uploaded successfully");
        fetchStudents();
      } catch (error) {
        console.error("Error uploading students:", error);
        toast.error("Failed to upload students");
      }
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === "all" || student.class === selectedClass;
    const matchesStatus = selectedStatus === "all" || 
                         (selectedStatus === "vaccinated" && student.vaccinations.length > 0) ||
                         (selectedStatus === "unvaccinated" && student.vaccinations.length === 0);
    return matchesSearch && matchesClass && matchesStatus;
  });

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
              <h3 className="text-2xl font-bold mt-1 text-gray-800">{students.length}</h3>
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
              <h3 className="text-2xl font-bold mt-1 text-gray-800">
                {students.filter(s => s.vaccinations.length > 0).length}
              </h3>
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
              <h3 className="text-2xl font-bold mt-1 text-gray-800">
                {students.filter(s => s.vaccinations.length === 0).length}
              </h3>
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
              <option value="10A">Class 10A</option>
              <option value="10B">Class 10B</option>
              <option value="11A">Class 11A</option>
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
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vaccination Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Vaccination
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        <div className="text-sm text-gray-500">Roll No: {student.rollNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.class}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      student.vaccinations.length > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {student.vaccinations.length > 0 ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Vaccinated
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Unvaccinated
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.vaccinations.length > 0
                        ? new Date(student.vaccinations[student.vaccinations.length - 1].date).toLocaleDateString()
                        : "Not vaccinated"}
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
              <div>
                <label className="block text-sm font-medium text-gray-700">Roll Number</label>
                <input
                  type="text"
                  className="input mt-1 w-full"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
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
              <div>
                <label className="block text-sm font-medium text-gray-700">Class</label>
                <select
                  className="input mt-1 w-full"
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  required
                >
                  <option value="">Select Class</option>
                  <option value="10A">Class 10A</option>
                  <option value="10B">Class 10B</option>
                  <option value="11A">Class 11A</option>
                </select>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingStudent(null);
                    setFormData({
                      rollNumber: "",
                      name: "",
                      class: "",
                      vaccinations: [],
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
    </div>
  );
};

export default Students;
