import React, { useEffect, useState } from "react";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("leaderboard");
    if (saved) setLeaders(JSON.parse(saved));
  }, []);

  const sorted = [...leaders].sort((a, b) => b.smokeFreeDays - a.smokeFreeDays);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black min-h-screen text-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
            Leaderboard
          </span>
        </h2>
        <p className="text-white/70">Top members with the most smoke-free days.</p>
      </div>

      {sorted.length === 0 ? (
        <p className="text-center text-white/60 text-lg">No data available.</p>
      ) : (
        <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-xl p-6 shadow">
          <table className="w-full text-left text-white/90">
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-3">#</th>
                <th className="pb-3">Name</th>
                <th className="pb-3">Smoke-Free Days</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((user, index) => (
                <tr
                  key={user.id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="py-3">{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.smokeFreeDays}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default Leaderboard;
