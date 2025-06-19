import React, { useEffect, useState } from "react";

const Permissions = () => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("roles");
    if (saved) setRoles(JSON.parse(saved));
    else {
      const defaultRoles = [
        { id: 1, name: "Admin", canEdit: true, canDelete: true },
        { id: 2, name: "Coach", canEdit: true, canDelete: false },
        { id: 3, name: "User", canEdit: false, canDelete: false },
      ];
      localStorage.setItem("roles", JSON.stringify(defaultRoles));
      setRoles(defaultRoles);
    }
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black min-h-screen text-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">Permissions</h2>
        <p className="text-white/60">Role-based access control overview</p>
      </div>

      <div className="max-w-3xl mx-auto bg-white/5 p-6 rounded shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-2">Role</th>
              <th className="pb-2">Can Edit</th>
              <th className="pb-2">Can Delete</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id} className="border-b border-white/10">
                <td className="py-3">{role.name}</td>
                <td>{role.canEdit ? "✅" : "❌"}</td>
                <td>{role.canDelete ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Permissions;
