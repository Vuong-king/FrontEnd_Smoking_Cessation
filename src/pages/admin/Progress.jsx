import React, { useEffect, useState } from "react";

const Progress = () => {
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("progress");
    if (saved) setProgress(JSON.parse(saved));
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black min-h-screen text-white">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">User Progress</h2>
        <p className="text-white/60">Track users' quit smoking progress</p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {progress.map((p) => (
          <div key={p.id} className="bg-white/5 rounded p-5 shadow border border-white/10">
            <h3 className="text-lg font-semibold mb-1">{p.name}</h3>
            <p className="text-white/70">Smoke-free days: {p.days}</p>
            <p className="text-white/70">Money saved: {p.money} VND</p>
            <p className="text-white/70">Health improvement: {p.health}%</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Progress;
