import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar,
  Users,
  Syringe,
  ChevronRight,
  Activity
} from "lucide-react";
import API_ENDPOINTS from "../../config/api";

const Drives = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDrive, setEditingDrive] = useState(null);
  const [formData, setFormData] = useState({
    vaccine: "",
    date: "",
    totalDoses: "",
    applicableClasses: [],
  });

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.DRIVES.LIST);
      setDrives(response.data || []);
    } catch (error) {
      console.error("Error fetching drives:", error);
      toast.error("Failed to fetch vaccination drives");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDrive) {
        await axios.put(API_ENDPOINTS.DRIVES.UPDATE(editingDrive._id), formData);
        toast.success("Drive updated successfully");
      } else {
        await axios.post(API_ENDPOINTS.DRIVES.CREATE, formData);
        toast.success("Drive scheduled successfully");
      }
      setShowAddModal(false);
      setEditingDrive(null);
      fetchDrives();
      setFormData({
        vaccine: "",
        date: "",
        totalDoses: "",
        applicableClasses: [],
      });
    } catch (error) {
      console.error("Error saving drive:", error);
      toast.error(editingDrive ? "Failed to update drive" : "Failed to schedule drive");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this drive?")) {
      try {
        await axios.delete(API_ENDPOINTS.DRIVES.DELETE(id));
        toast.success("Drive deleted successfully");
        fetchDrives();
      } catch (error) {
        console.error("Error deleting drive:", error);
        toast.error("Failed to delete drive");
      }
    }
  };

  const filteredDrives = drives.filter(drive => {
    if (!drive) return false;
    return (drive.vaccine?.toLowerCase() || '').includes(searchTerm.toLowerCase());
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
            Vaccination Drives
          </h1>
          <p className="text-muted-foreground mt-1">
            Schedule and manage vaccination drives
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Schedule Drive
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Drives</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-800">{drives?.length || 0}</h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Activity className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Doses</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-800">
                {drives?.reduce((sum, drive) => sum + (drive?.totalDoses || 0), 0) || 0}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center">
              <Syringe className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search drives by vaccine name..."
                className="input pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Drives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrives.map((drive) => (
          <div key={drive?._id} className="glass-card p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Syringe className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{drive?.vaccine || 'Unnamed Drive'}</h3>
                  <p className="text-sm text-gray-500">{drive?.applicableClasses?.join(', ') || 'No Classes'}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{drive?.date ? new Date(drive.date).toLocaleDateString() : 'No date set'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{drive?.totalDoses || 0} doses</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
              <button
                onClick={() => {
                  setEditingDrive(drive);
                  setFormData(drive || {
                    vaccine: "",
                    date: "",
                    totalDoses: "",
                    applicableClasses: [],
                  });
                  setShowAddModal(true);
                }}
                className="text-primary hover:text-primary-dark p-2"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(drive?._id)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="glass-card p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingDrive ? "Edit Drive" : "Schedule New Drive"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Vaccine Name</label>
                <input
                  type="text"
                  className="input mt-1 w-full"
                  value={formData?.vaccine || ""}
                  onChange={(e) => setFormData({ ...formData, vaccine: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  className="input mt-1 w-full"
                  value={formData?.date ? new Date(formData.date).toISOString().split('T')[0] : ""}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Doses</label>
                <input
                  type="number"
                  className="input mt-1 w-full"
                  value={formData?.totalDoses || ""}
                  onChange={(e) => setFormData({ ...formData, totalDoses: e.target.value })}
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Applicable Classes</label>
                <select
                  className="input mt-1 w-full"
                  value={formData?.applicableClasses?.[0] || ""}
                  onChange={(e) => setFormData({ ...formData, applicableClasses: [e.target.value] })}
                  required
                >
                  <option value="">Select Class</option>
                  <option value="4A">Class 4A</option>
                  <option value="5A">Class 5A</option>
                  <option value="5B">Class 5B</option>
                  <option value="6A">Class 6A</option>
                  <option value="6B">Class 6B</option>
                </select>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingDrive(null);
                    setFormData({
                      vaccine: "",
                      date: "",
                      totalDoses: "",
                      applicableClasses: [],
                    });
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingDrive ? "Update" : "Schedule"} Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drives; 