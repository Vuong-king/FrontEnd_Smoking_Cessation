import React, { useState } from "react";

const Settings = () => {
  const [emailNotify, setEmailNotify] = useState(true);
  const [smsNotify, setSmsNotify] = useState(false);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black min-h-screen text-white">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">System Settings</h2>
        <p className="text-white/60">Platform configurations and preferences</p>
      </div>

      <div className="max-w-xl mx-auto bg-white/5 p-6 rounded shadow space-y-6">
        <div className="flex justify-between items-center">
          <label className="text-white/80">Email notifications</label>
          <input
            type="checkbox"
            checked={emailNotify}
            onChange={(e) => setEmailNotify(e.target.checked)}
          />
        </div>
        <div className="flex justify-between items-center">
          <label className="text-white/80">SMS reminders</label>
          <input
            type="checkbox"
            checked={smsNotify}
            onChange={(e) => setSmsNotify(e.target.checked)}
          />
        </div>
      </div>
    </section>
  );
};

export default Settings;
