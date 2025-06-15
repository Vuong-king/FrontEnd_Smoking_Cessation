import React from "react";
import { Info } from "lucide-react";

export function NotificationBanner({ message }) {
  return (
    <div className="flex items-center bg-purple-700 text-white px-4 py-2 rounded-lg shadow mb-4">
      <Info className="w-5 h-5 mr-2" />
      <span>{message}</span>
    </div>
  );
}
