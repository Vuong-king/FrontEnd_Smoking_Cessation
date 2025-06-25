import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Outlet } from "react-router-dom";
import "antd/dist/reset.css";

// Layout
import { Navbar } from "./layouts/Navbar";
import { Footer } from "./layouts/Footer";
import ScrollToTop from "./layouts/ScrolltoTop";
import UserLayout from "./layouts/user/UserLayout";
import { AuthProvider, useAuth } from "./context/AuthContext";
import UserHeader from "./layouts/user/UserHeader";
import AdminLayout from "./components/admin/AdminLayout";

// Pages
import HomePages from "./pages/generic/home/HomePage";
import AuthPage from "./pages/auth/AuthPage";
import NotFoundPage from "./pages/error/404Page";
import DashBoardUser from "./pages/user/DashBoardUser";
import UserBlogPage from "./pages/user/UserBlogPage";
import SmokingStatusPage from "./pages/user/SmokingStatusPage";
import ProfilePage from "./pages/user/ProfilePage";
import StagesPage from "./pages/generic/StagesPage";
import BlogPage from "./pages/generic/BlogPage";

// Admin pages
import AdminDashboardHome from "./pages/admin/AdminDashboardHome";
import Users from "./pages/admin/Users";
import Subscriptions from "./pages/admin/Subscriptions";
import Badges from "./pages/admin/Badges";
import BlogPosts from "./pages/admin/BlogPosts";
import BlogDetail from "./components/generic/blog/BlogDetail";
import Feedbacks from "./pages/admin/Feedbacks";
import Leaderboard from "./pages/admin/Leaderboard";
import Notifications from "./pages/admin/Notifications";
import Progress from "./pages/admin/Progress";
import QuitPlans from "./pages/admin/QuitPlans";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import Coaches from "./pages/admin/Coaches";
import UserAchievement from "./pages/user/UserAchievement";
import UserSupport from "./pages/user/UserSupport";
import UserProgress from "./pages/user/UserProgress";
import UserQuitPlanPage from "./pages/user/UserQuitPlanPage";
import QuitPlanPage from "./pages/generic/QuitPlanPage";
import QuitPlanDetailPage from "./pages/generic/QuitPlanDetailPage";
import Stages from "./pages/admin/Stage";
import CoachLayout from "./components/coach/CoachLayout";
import CoachQuitPlan from "./pages/coach/CoachQuitPlan";
import RequestQuitPlan from "./pages/coach/RequestQuitPlan";
import StagesCoach from "./pages/coach/StagesCoach";
import Request from "./pages/admin/Request";
import QuitPlanDetailPageAdmin from "./pages/admin/QuitPlansDetail";

// ===== Layout Wrapper =====
const Layout = () => {
  const { user } = useAuth();

  return (
    <div className='min-h-screen bg-black text-white'>
      {user ? <UserHeader /> : <Navbar />}
      <main className='mt-16'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// ===== App with Routing =====
function App() {
  return (

    <div className="bg-white min-h-screen">
      <Router>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            {/* Auth route */}
            <Route path="/login" element={<AuthPage />} />
            <Route path="/login/:token" element={<AuthPage />} />

            {/* Main layout routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<HomePages />} />
              <Route path="/quit-plan" element={<QuitPlanPage />} />
              <Route path="/quit-plan-detail/:id" element={<QuitPlanDetailPage />} />
              <Route path="/stages/:id" element={<StagesPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="blog/:id" element={<BlogDetail />} />
            </Route>

            {/* User routes */}
            <Route path="/user" element={<UserLayout />}>
              <Route path="dashboard" element={<DashBoardUser />} />
              <Route path="quitplan" element={<UserQuitPlanPage />} />
              <Route path="profile/:id" element={<ProfilePage />} />
              <Route path="blog" element={<UserBlogPage />} />
              <Route path="smoking-status" element={<SmokingStatusPage />} />
              <Route path="progress" element={<UserProgress />} />
              <Route path="achievements" element={<UserAchievement />} />
              <Route path="support" element={<UserSupport />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardHome />} />
              <Route path="users" element={<Users />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="badges" element={<Badges />} />
              <Route path="stages" element={<Stages />} />
              <Route path="feedbacks" element={<Feedbacks />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="roles" element={<Permissions />} />
              <Route path="progress" element={<Progress />} />
              <Route path="quit-plans" element={<QuitPlans />} />
              <Route path="quit-plans/:id" element={<QuitPlanDetailPageAdmin />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="coaches" element={<Coaches />} />
              <Route path="blogs" element={<BlogPosts />} />
              <Route path="blogs/:id" element={<BlogDetail />} />
              <Route path="/admin/request" element={<Request />} />
            </Route>

            {/* 404 route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>

   
  );
}

export default App;
