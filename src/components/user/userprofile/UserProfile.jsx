
import { Button, Card } from "antd";
import { Mail, User, Calendar, Lock } from "lucide-react";

const UserProfile = ({ user }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-gradient-to-br from-[#1e1e2f] to-[#111] shadow-2xl rounded-2xl p-6">
          {/* Avatar + Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{user?.name}</h2>
              <p className="text-sm text-gray-300 flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {user?.email}
              </p>
              <p className="text-sm text-blue-400">Role: {user?.role}</p>
            </div>
          </div>

          {/* Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-[#2a2a3d] p-4 rounded-xl">
              <p className="text-gray-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Joined: <span className="text-white">{user?.createdAt?.slice(0, 10)}</span>
              </p>
            </div>
            <div className="bg-[#2a2a3d] p-4 rounded-xl">
              <p className="text-gray-400 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Status: <span className="text-green-400">Active</span>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-4">
            <Button variant="secondary" className="bg-purple-600 hover:bg-purple-700 transition">
              Edit Profile
            </Button>
            <Button variant="ghost" className="border border-purple-500 text-purple-400 hover:bg-purple-500/10">
              Change Password
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default UserProfile;