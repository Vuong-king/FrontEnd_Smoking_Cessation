import React from "react";

const Badges = () => {
  const badges = [
    { name: "First Step", description: "Completed first quit plan" },
    { name: "Streak Master", description: "7 days smoke-free" },
    { name: "Champion", description: "30 days smoke-free" },
  ];

  return (
    <section className="py-10 px-6 bg-gradient-to-b from-black to-gray-900 min-h-screen">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">Badges</span>
        </h2>
        <p className="text-white/70">Review the list of achievements and their requirements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {badges.map((badge, idx) => (
          <div key={idx} className="bg-white/5 rounded-xl p-6 hover:border-cyan-500/50 border border-white/10">
            <h3 className="text-xl font-semibold mb-2">{badge.name}</h3>
            <p className="text-white/70">{badge.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Badges;