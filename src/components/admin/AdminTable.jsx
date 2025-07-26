import React from "react";

export function AdminTable({ data, columns }) {
  return (
    <div className="overflow-x-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow hover:border-purple-500/50 transition-all">
      <table className="min-w-full text-sm">
        <thead className="bg-white-to-r from-purple-600 to-cyan-600 text-white rounded">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-4 py-2 text-left">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-t border-white/10 hover:bg-white/10">
              {columns.map((col, i) => (
                <td key={i} className="px-4 py-2">
                  {row[col.toLowerCase()]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
