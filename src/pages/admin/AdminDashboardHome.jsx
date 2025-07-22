
import React, { useEffect, useState } from "react";
import { Users, CreditCard, DollarSign, MessageSquare } from "lucide-react";
import { ChartCard } from "../../components/admin/ChartCard";
import { PieChartCard } from "../../components/admin/PieChartCard";
import ColourfulText from "../../components/ui/ColourfulText";
import UserService from "../../services/userService";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const AdminDashboardHome = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Derived chart data from API
  const userGrowthData = data?.charts?.userGrowth?.map(item => ({
    month: monthNames[(item.month - 1) % 12] + ' ' + item.year,
    users: item.count
  })) || [
    { month: "Jan", users: 200 },
    { month: "Feb", users: 400 },
    { month: "Mar", users: 800 },
    { month: "Apr", users: 1500 },
    { month: "May", users: 2400 },
    { month: "Jun", users: 3200 },
  ];

  const planData = data?.charts?.subscriptionDistribution?.map(item => ({
    name: item.name,
    value: item.count
  })) || [
    { name: "Basic", value: 100 },
    { name: "Premium", value: 140 },
    { name: "Family", value: 80 },
  ];

  const revenueData = data?.charts?.revenueOverview?.map(item => ({
    month: monthNames[(item.month - 1) % 12] + ' ' + item.year,
    revenue: item.total
  })) || [
    { month: "Jan", revenue: 1000 },
    { month: "Feb", revenue: 1500 },
    { month: "Mar", revenue: 2200 },
    { month: "Apr", revenue: 2800 },
    { month: "May", revenue: 2900 },
    { month: "Jun", revenue: 3050 },
  ];

  const feedbackData = data?.charts?.feedbackTypes?.map(item => ({
    type: item.name,
    value: item.count
  })) || [
    { type: "Bug", value: 30 },
    { type: "Idea", value: 50 },
    { type: "Praise", value: 48 },
  ];

  const kpi = data?.kpi || {
    totalUsers: 1250,
    activePlans: 320,
    totalRevenue: 12450,
    totalFeedbacks: 128
  };

  const fetchBadges = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await UserService.adminDashboard();
      setData(response);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBadges();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-xl">Loading dashboard...</div>;
  }
  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-xl text-red-500">{error}</div>;
  }

  return (
    <section
      className="py-16 bg-gray-100 min-h-screen text-gray-800"
    >
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Welcome to the{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
            <ColourfulText text="Admin Dashboard"/>
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mx-auto max-w-full">
            Monitor, manage, and optimize your platform’s performance all in one
            place.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
          <div className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl p-6 shadow-lg border border-white hover:scale-[1.03] hover:shadow-xl transition-all duration-300 text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Total Users</h3>
            <p className="text-3xl font-bold">{kpi.totalUsers}</p>
          </div>

          <div className="bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-xl p-6 shadow-lg border border-white hover:scale-[1.03] hover:shadow-xl transition-all duration-300 text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Active Plans</h3>
            <p className="text-3xl font-bold">{kpi.activePlans}</p>
          </div>

          <div className="bg-gradient-to-r from-blue-400 to-violet-500 text-white rounded-xl p-6 shadow-lg border border-white hover:scale-[1.03] hover:shadow-xl transition-all duration-300 text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Total Revenue</h3>
            <p className="text-3xl font-bold">{kpi.totalRevenue?.toLocaleString?.('en-US', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }) || kpi.totalRevenue}</p>
          </div>

          <div className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white rounded-xl p-6 shadow-lg border border-white hover:scale-[1.03] hover:shadow-xl transition-all duration-300 text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Feedbacks</h3>
            <p className="text-3xl font-bold">{kpi.totalFeedbacks}</p>
          </div>
        </div>
        {/* Chart Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Growth */}
          <div className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white p-6 rounded-xl shadow-md border border-white hover:scale-[1.03] hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold mb-4">User Growth</h3>
            <ChartCard
              title=""
              data={userGrowthData}
              dataKeyX="month"
              dataKeyY="users"
              color="#0ea5e9"
            />
          </div>

          {/* Active Plan Distribution */}
          <div className="bg-gradient-to-r from-purple-400 to-pink-500 text-white p-6 rounded-xl shadow-md border border-white hover:scale-[1.03] hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold mb-4">
              Active Plan Distribution
            </h3>
            <div className="p-4 border border-white rounded-xl shadow-inner backdrop-blur-md bg-white/10">
              <PieChartCard
                title=""
                data={planData}
                dataKey="value"
                nameKey="name"
              />
            </div>
          </div>

          {/* Revenue Overview */}
          <div className="bg-gradient-to-r from-blue-400 to-violet-500 text-white p-6 rounded-xl shadow-md border border-white hover:scale-[1.03] hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
            <ChartCard
              title=""
              data={revenueData}
              dataKeyX="month"
              dataKeyY="revenue"
              color="#c084fc"
            />
          </div>

          {/* Feedback Types */}
          <div className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white p-6 rounded-xl shadow-md border border-white hover:scale-[1.03] hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-semibold mb-4">Feedback Types</h3>
            <div className="p-4 border border-white rounded-xl shadow-inner backdrop-blur-md bg-white/10">
              <PieChartCard
                title=""
                data={feedbackData}
                dataKey="value"
                nameKey="type"
              />
            </div>
          </div>
        </div>

        <br />

        {/* Stats Cards */}
        
      </div>
    </section>
  );
};

export default AdminDashboardHome;
