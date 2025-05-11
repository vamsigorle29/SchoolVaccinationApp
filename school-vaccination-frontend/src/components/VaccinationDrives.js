import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, MapPin, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import API_ENDPOINTS from '../config/api';

// Configure axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

const VaccinationDrives = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('VaccinationDrives mounted');
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiUrl = API_ENDPOINTS.DRIVES.LIST;
      console.log('Fetching drives from:', apiUrl);

      const response = await axios.get(apiUrl);
      console.log('Raw API Response:', response);

      if (response.data && Array.isArray(response.data)) {
        console.log('Setting drives data:', response.data);
        setDrives(response.data);
      } else {
        console.error('Invalid response format:', response.data);
        setError('Invalid response format from server');
        toast.error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error fetching drives:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.data.message || 'Server error occurred');
      } else if (error.request) {
        console.error('No response received:', error.request);
        setError('No response received from server');
      } else {
        console.error('Error message:', error.message);
        setError(error.message);
      }
      toast.error('Failed to fetch vaccination drives');
    } finally {
      setLoading(false);
    }
  };

  // Debug render
  console.log('Current drives state:', drives);
  console.log('Loading state:', loading);
  console.log('Error state:', error);

  const getStatusColor = (date) => {
    const today = new Date();
    const driveDate = new Date(date);
    
    if (driveDate < today) {
      return 'bg-green-100 text-green-800';
    } else if (driveDate.toDateString() === today.toDateString()) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (date) => {
    const today = new Date();
    const driveDate = new Date(date);
    
    if (driveDate < today) {
      return <CheckCircle2 className="h-4 w-4" />;
    } else if (driveDate.toDateString() === today.toDateString()) {
      return <AlertCircle className="h-4 w-4" />;
    } else {
      return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (date) => {
    const today = new Date();
    const driveDate = new Date(date);
    
    if (driveDate < today) {
      return 'Completed';
    } else if (driveDate.toDateString() === today.toDateString()) {
      return 'In Progress';
    } else {
      return 'Scheduled';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={fetchDrives}
          className="btn btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!drives || drives.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-gray-500 mb-4">No vaccination drives found</div>
        <button 
          onClick={fetchDrives}
          className="btn btn-primary"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Vaccination Drives</h2>
        <button className="btn btn-primary flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Schedule New Drive
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drives.map((drive) => {
          console.log('Rendering drive:', drive);
          return (
            <div key={drive._id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{drive.vaccine}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {new Date(drive.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Classes {drive.applicableClasses.join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {drive.totalDoses} doses available
                    </span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${getStatusColor(drive.date)}`}>
                  {getStatusIcon(drive.date)}
                  <span>{getStatusText(drive.date)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VaccinationDrives; 