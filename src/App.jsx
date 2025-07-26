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
// import ScrollToTop from "./layouts/ScrolltoTop";
import UserLayout from "./layouts/user/UserLayout";
import { AuthProvider, useAuth } from "./context/AuthContext";
import UserHeader from "./layouts/user/UserHeader";
import AdminLayout from "./components/admin/AdminLayout";
import CoachLayout from "./components/coach/CoachLayout";

// Pages - Generic
import HomePages from "./pages/generic/home/HomePage";
import AuthPage from "./pages/auth/AuthPage";
import NotFoundPage from "./pages/error/404Page";
import BlogPage from "./pages/generic/BlogPage";
import BlogDetail from "./components/generic/blog/BlogDetail";
import QuitPlanPage from "./pages/generic/QuitPlanPage";
import QuitPlanDetailPage from "./pages/generic/QuitPlanDetailPage";
import PaymentSuccessPage from "./pages/generic/PaymentSuccessPage";
import PaymentCancelPage from "./pages/generic/PaymentCancelPage";

// Pages - User
import UserBlogPage from "./pages/user/UserBlogPage";
import SmokingStatusPage from "./pages/user/SmokingStatusPage";
import ProfilePage from "./pages/user/ProfilePage";
import UserAchievement from "./pages/user/UserAchievement";
import UserProgress from "./pages/user/UserProgress";
import UserQuitPlanPage from "./pages/user/UserQuitPlanPage";


// Pages - Admin
import AdminDashboardHome from "./pages/admin/AdminDashboardHome";
import Users from "./pages/admin/Users";
import Subscriptions from "./pages/admin/Subscriptions";
import Badges from "./pages/admin/Badges";
import Feedbacks from "./pages/admin/Feedbacks";
import Leaderboard from "./pages/admin/Leaderboard";
import Notifications from "./pages/admin/Notifications";
import Progress from "./pages/admin/Progress";
import QuitPlans from "./pages/admin/QuitPlans";
import QuitPlanDetailPageAdmin from "./pages/admin/QuitPlansDetail";
import BlogPosts from "./pages/admin/BlogPosts";
import Request from "./pages/admin/Request";
import Stages from "./pages/admin/Stage";

// Pages - Coach
import CoachQuitPlan from "./pages/coach/CoachQuitPlan";
import RequestQuitPlan from "./pages/coach/RequestQuitPlan";
import StagesCoach from "./pages/coach/StagesCoach";

// Components
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import ResetPassword from "./components/auth/ResetPassword";
import ResetPasswordWithToken from "./components/auth/ResetPasswordWithToken";

import CoachProgress from "./pages/coach/CoachProgress";
import CoachNotification from "./pages/coach/CoachNotification";
import CoachMeetSession from "./pages/coach/CoachMeetSession";
import RankingPage from "./pages/generic/RankingPage";
import PackageItem from "./pages/admin/PackageItem";
import UserMeetSessionPage from "./pages/user/UserMeetSessionPage";
import PlanStageView from "./components/generic/quitplan/PlanStageView";
import MyQuitPlanPage from "./pages/user/MyQuitPlanPage";

// ===== Layout Wrapper =====
const Layout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white text-black ">
      {user ? <UserHeader /> : <Navbar />}
      <main className="pt-24">
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
          {/* <ScrollToTop /> */}
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<AuthPage />} />
            <Route path="/login/:token" element={<AuthPage />} />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />
            <Route path="/payment-cancel" element={<PaymentCancelPage />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/resset-password/:token"
              element={<ResetPasswordWithToken />}
            />
            {/* Public layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<HomePages />} />
              <Route path="/quit-plan" element={<QuitPlanPage />} />
              <Route
                path="/quit-plan-detail/:id"
                element={<QuitPlanDetailPage />}
              />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route
                path="/stages/:id"
                element={<PlanStageView />}
              />
              <Route path="/ranking" element={<RankingPage />} />
            </Route>

            {/* User protected routes */}
            <Route
              path="/user"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <UserLayout />
                </ProtectedRoute>
              }
            >
              <Route path="quitplan" element={<UserQuitPlanPage />} />
              <Route path="profile/:id" element={<ProfilePage />} />
              <Route path="blog" element={<UserBlogPage />} />
              <Route path="smoking-status" element={<SmokingStatusPage />} />
              <Route path="progress" element={<UserProgress />} />
              <Route path="achievements" element={<UserAchievement />} />
              <Route path="meet-session" element={<UserMeetSessionPage />} />
              <Route path="my-quit-plans" element={<MyQuitPlanPage />} />
            </Route>

            {/* Admin protected routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboardHome />} />
              <Route path="users" element={<Users />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="badges" element={<Badges />} />
              <Route path="stages" element={<Stages />} />
              <Route path="feedbacks" element={<Feedbacks />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="progress" element={<Progress />} />
              <Route path="quit-plans" element={<QuitPlans />} />
              <Route path="packages" element={<PackageItem />} />
              <Route
                path="quit-plans/:id"
                element={<QuitPlanDetailPageAdmin />}
              />
              <Route path="blogs" element={<BlogPosts />} />
              <Route path="blogs/:id" element={<BlogDetail />} />
              <Route path="request" element={<Request />} />
              <Route path="profile/:id" element={<ProfilePage />} />
            </Route>

            {/* Coach protected routes */}
            <Route
              path="/coach"
              element={
                <ProtectedRoute allowedRoles={["coach"]}>
                  <CoachLayout />
                </ProtectedRoute>
              }
            >
              <Route path="my-quit-plans" element={<CoachQuitPlan />} />
              <Route path="quit-plans-request" element={<RequestQuitPlan />} />
              <Route path="stages" element={<StagesCoach />} />
            </Route>
            <Route path="/coach" element={<CoachLayout />}>
              <Route path="my-quit-plans" element={<CoachQuitPlan />} />
              <Route path="quit-plans-request" element={<RequestQuitPlan />} />
              <Route path="stages" element={<StagesCoach />} />
              <Route path="progress" element={<CoachProgress />} />
              <Route path="notifications" element={<CoachNotification />} />
              <Route path="meet-session" element={<CoachMeetSession />} />
            </Route>

            {/* Unauthorized + 404 */}

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
