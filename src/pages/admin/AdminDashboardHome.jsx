import React from "react";

const AdminDashboardHome = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome to the <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">Admin Dashboard</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Monitor, manage, and optimize your platform’s performance all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-all text-center">
            <h3 className="text-xl font-semibold mb-2">Total Users</h3>
            <p className="text-3xl font-bold">1,250</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 transition-all text-center">
            <h3 className="text-xl font-semibold mb-2">Active Plans</h3>
            <p className="text-3xl font-bold">320</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-all text-center">
            <h3 className="text-xl font-semibold mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold">$12,450</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 transition-all text-center">
            <h3 className="text-xl font-semibold mb-2">Feedbacks</h3>
            <p className="text-3xl font-bold">128</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboardHome;



