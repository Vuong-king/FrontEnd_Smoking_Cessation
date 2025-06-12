import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Outlet } from "react-router-dom";
import "antd/dist/reset.css";

// Layout
import { Navbar } from "./layouts/Navbar";
import { Footer } from "./layouts/Footer";
import ScrollToTop from "./layouts/ScrolltoTop";
import UserLayout from "./layouts/user/UserLayout";
import { AuthProvider, useAuth } from "./context/AuthContext";
import UserHeader from "./layouts/user/UserHeader";

// Pages
import HomePages from "./pages/generic/home/HomePage";
import AuthPage from "./pages/auth/AuthPage";
import NotFoundPage from "./pages/error/404Page";
import DashBoardUser from "./pages/user/DashBoardUser";
import BlogPages from "./pages/generic/blogs/BlogPages";
import QuitPlanPage from "./pages/user/QuitPlanPage";
import UserBlogPage from "./pages/user/UserBlogPage";
import SmokingStatusPage from "./pages/user/SmokingStatusPage";
import ProfilePage from "./pages/user/ProfilePage";
import BlogDetail from "./components/user/blog/BlogDetail";


// ===== Layout Wrapper =====
const Layout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white">
      {user ? <UserHeader /> : <Navbar />}
      <main className="mt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// ===== App with Routing =====
function App() {
  return (
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
            <Route path="/blog" element={<BlogPages />} />
          </Route>

          {/* User routes */}
          <Route path="/user" element={<UserLayout />}>
            <Route path="dashboard" element={<DashBoardUser />} />
            <Route path="quitplan" element={<QuitPlanPage />} />
            <Route path="profile/:id" element={<ProfilePage />} />
            <Route path="blog" element={<UserBlogPage />} />
            <Route path="smoking-status" element={<SmokingStatusPage />} />
            <Route path= "blog/:id" element={<BlogDetail />} />
          </Route>

          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
