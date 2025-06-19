import React from "react";
import { Users, CreditCard, DollarSign, MessageSquare } from "lucide-react";
import { ChartCard } from "../../components/admin/ChartCard";
import { PieChartCard } from "../../components/admin/PieChartCard";

const userGrowthData = [
  { month: "Jan", users: 200 },
  { month: "Feb", users: 400 },
  { month: "Mar", users: 800 },
  { month: "Apr", users: 1500 },
  { month: "May", users: 2400 },
  { month: "Jun", users: 3200 },
];
const planData = [
  { name: "Basic", value: 100 },
  { name: "Premium", value: 140 },
  { name: "Family", value: 80 },
];
const revenueData = [
  { month: "Jan", revenue: 1000 },
  { month: "Feb", revenue: 1500 },
  { month: "Mar", revenue: 2200 },
  { month: "Apr", revenue: 2800 },
  { month: "May", revenue: 2900 },
  { month: "Jun", revenue: 3050 },
];
const feedbackData = [
  { type: "Bug", value: 30 },
  { type: "Idea", value: 50 },
  { type: "Praise", value: 48 },
];

const AdminDashboardHome = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black min-h-screen text-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard
  title="User Growth"
  data={userGrowthData}
  dataKeyX="month"
  dataKeyY="users"
  color="#0ea5e9"
/>

<PieChartCard
  title="Active Plan Distribution"
  data={planData}
  dataKey="value"
  nameKey="name"
/>

<ChartCard
  title="Revenue Overview"
  data={revenueData}
  dataKeyX="month"
  dataKeyY="revenue"
  color="#c084fc"
/>

<PieChartCard
  title="Feedback Types"
  data={feedbackData}
  dataKey="value"
  nameKey="type"
/>
</div>
  <br></br>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome to the{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
              Admin Dashboard
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Monitor, manage, and optimize your platform’s performance all in one
            place.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:scale-[1.03] hover:shadow-lg hover:border-purple-500/60 transition-all duration-300 text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center shadow-inner">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Total Users</h3>
            <p className="text-3xl font-bold">1,250</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:scale-[1.03] hover:shadow-lg hover:border-cyan-500/60 transition-all duration-300 text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center shadow-inner">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Active Plans</h3>
            <p className="text-3xl font-bold">320</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:scale-[1.03] hover:shadow-lg hover:border-purple-500/60 transition-all duration-300 text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center shadow-inner">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Total Revenue</h3>
            <p className="text-3xl font-bold">$12,450</p>
          </div>

          {/* Card 4 */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:scale-[1.03] hover:shadow-lg hover:border-cyan-500/60 transition-all duration-300 text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shadow-inner">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Feedbacks</h3>
            <p className="text-3xl font-bold">128</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboardHome;
