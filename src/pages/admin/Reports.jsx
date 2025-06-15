import React from "react";

const Reports = () => {
  const stats = {
    totalUsers: 1250,
    activePlans: 430,
    totalFeedback: 128,
    totalSavedMoney: 45000000,
    avgSmokeFreeDays: 18.4,
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black min-h-screen text-white">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">Reports & Insights</h2>
        <p className="text-white/60">Platform-wide statistics and impact</p>
      </div>

      <div className="max-w-4xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Object.entries(stats).map(([key, value]) => (
          <div
            key={key}
            className="bg-white/5 p-6 rounded-lg border border-white/10 hover:shadow-lg hover:border-cyan-400 transition"
          >
            <h4 className="text-lg font-semibold mb-1 capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </h4>
            <p className="text-2xl font-bold">{typeof value === "number" ? value.toLocaleString() : value}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reports;
