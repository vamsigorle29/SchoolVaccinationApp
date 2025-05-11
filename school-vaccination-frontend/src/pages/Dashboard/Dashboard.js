import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
  Users, 
  Syringe, 
  Calendar, 
  TrendingUp, 
  Clock, 
  MapPin,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Activity
} from "lucide-react";
import API_ENDPOINTS from "../../config/api";
import VaccinationDrives from "../../components/VaccinationDrives";

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalStudents: 0,
    vaccinationStats: {
      fullyVaccinated: 0,
      partiallyVaccinated: 0,
      notVaccinated: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    console.log('Dashboard mounted');
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('Fetching dashboard data...');
      const response = await axios.get(API_ENDPOINTS.DASHBOARD.SUMMARY);
      console.log('Dashboard API Response:', response.data);
      
      const data = response.data.data;
      setSummary({
        totalStudents: data.totalStudents || 0,
        vaccinationStats: data.vaccinationStats || {
          fullyVaccinated: 0,
          partiallyVaccinated: 0,
          notVaccinated: 0
        }
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error(error.response?.data?.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Total Students",
      value: summary.totalStudents,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      trend: "+12%",
      trendUp: true
    },
    {
      title: "Fully Vaccinated",
      value: summary.vaccinationStats.fullyVaccinated,
      icon: Syringe,
      color: "text-green-500",
      bgColor: "bg-green-50",
      trend: "+8%",
      trendUp: true
    },
    {
      title: "Partially Vaccinated",
      value: summary.vaccinationStats.partiallyVaccinated,
      icon: Syringe,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
      trend: "+5%",
      trendUp: true
    },
    {
      title: "Not Vaccinated",
      value: summary.vaccinationStats.notVaccinated,
      icon: Users,
      color: "text-red-500",
      bgColor: "bg-red-50",
      trend: "-5%",
      trendUp: false
    },
  ];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 space-y-8">
      {/* Welcome Section with Quick Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome back!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your vaccination program today.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="btn btn-primary flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Drive
          </button>
          <button className="btn btn-outline flex items-center gap-2">
            <Users className="h-4 w-4" />
            Add Students
          </button>
        </div>
      </div>

      {/* Stats Grid with Enhanced Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="glass-card p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold mt-1 text-gray-800">{stat.value}</h3>
                <div className="flex items-center mt-2">
                  <span className={`text-sm ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.trend}
                  </span>
                  <TrendingUp className={`h-4 w-4 ml-1 ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`} />
                </div>
              </div>
              <div className={`h-12 w-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Vaccination Drives Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <VaccinationDrives key="vaccination-drives" />
      </div>
    </div>
  );
};

export default Dashboard; 