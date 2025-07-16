import { Outlet } from "react-router-dom";
import SidebarCoach from "./SidebarCoach";

const CoachLayout = () => {
  return (
    <div className='flex min-h-screen w-full text-black'>
      <SidebarCoach />
      <main className='flex-1 p-8 overflow-y-auto bg-white'>
        <Outlet />
      </main>
    </div>
  );
};

export default CoachLayout;
