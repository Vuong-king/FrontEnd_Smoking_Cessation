import React from "react";

const Subscriptions = () => {
  const subscriptions = [
    { id: 1, name: "Basic", price: "$9/mo", status: "Active" },
    { id: 2, name: "Premium", price: "$19/mo", status: "Active" },
    { id: 3, name: "Family", price: "$29/mo", status: "Inactive" },
  ];

  return (
    <section className="py-10 px-6 bg-gradient-to-b from-black to-gray-900 min-h-screen">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">Subscriptions</span>
        </h2>
        <p className="text-white/70">Manage and review all active and past subscriptions.</p>
      </div>

      <div className="max-w-4xl mx-auto bg-white/5 rounded-xl p-6">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th>Name</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub.id} className="border-b border-white/10">
                <td>{sub.name}</td>
                <td>{sub.price}</td>
                <td>{sub.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
export default Subscriptions;