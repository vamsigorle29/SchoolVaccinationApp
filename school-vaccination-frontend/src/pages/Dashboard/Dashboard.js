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

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalStudents: 0,
    vaccinated: 0,
    unvaccinated: 0,
    upcomingDrives: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.DASHBOARD.SUMMARY);
      const data = response.data;
      setSummary({
        totalStudents: data.totalStudents || 0,
        vaccinated: data.vaccinated || 0,
        unvaccinated: data.unvaccinated || 0,
        upcomingDrives: data.upcomingDrives || 0,
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
      title: "Vaccinated Students",
      value: summary.vaccinated,
      icon: Syringe,
      color: "text-green-500",
      bgColor: "bg-green-50",
      trend: "+8%",
      trendUp: true
    },
    {
      title: "Unvaccinated Students",
      value: summary.unvaccinated,
      icon: Users,
      color: "text-red-500",
      bgColor: "bg-red-50",
      trend: "-5%",
      trendUp: false
    },
    {
      title: "Upcoming Drives",
      value: summary.upcomingDrives,
      icon: Calendar,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      trend: "+3",
      trendUp: true
    },
  ];

  const recentActivities = [
    { type: 'vaccination', status: 'completed', message: 'COVID-19 vaccination completed for Class 10A', time: '2 hours ago' },
    { type: 'drive', status: 'scheduled', message: 'New vaccination drive scheduled for next week', time: '4 hours ago' },
    { type: 'student', status: 'added', message: 'New student records added', time: '1 day ago' },
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

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vaccination Progress */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Vaccination Progress</h2>
            <div className="flex gap-2">
              <button 
                className={`px-3 py-1 rounded-full text-sm ${activeTab === 'overview' ? 'bg-primary text-white' : 'bg-gray-100'}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`px-3 py-1 rounded-full text-sm ${activeTab === 'details' ? 'bg-primary text-white' : 'bg-gray-100'}`}
                onClick={() => setActiveTab('details')}
              >
                Details
              </button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary/10">
                    Progress
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-primary">
                    {Math.round((summary.vaccinated / summary.totalStudents) * 100)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200">
                <div
                  style={{ width: `${(summary.vaccinated / summary.totalStudents) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4 bg-green-50">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Vaccinated</span>
                </div>
                <p className="text-2xl font-bold mt-2 text-green-600">{summary.vaccinated}</p>
              </div>
              <div className="glass-card p-4 bg-red-50">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="font-medium">Unvaccinated</span>
                </div>
                <p className="text-2xl font-bold mt-2 text-red-600">{summary.unvaccinated}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  activity.status === 'completed' ? 'bg-green-100' :
                  activity.status === 'scheduled' ? 'bg-blue-100' :
                  'bg-purple-100'
                }`}>
                  {activity.status === 'completed' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> :
                   activity.status === 'scheduled' ? <Calendar className="h-4 w-4 text-blue-500" /> :
                   <Users className="h-4 w-4 text-purple-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-sm text-primary hover:text-primary-dark font-medium flex items-center justify-center gap-2">
            View All Activity
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Upcoming Drives */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Upcoming Vaccination Drives</h2>
          <button className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-2">
            View All
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="glass-card p-4 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">COVID-19 Vaccination</h3>
                  <p className="text-sm text-gray-500">Class {['10A', '10B', '11A'][index]}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Mar {15 + index}, 2024</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>9:00 AM</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 