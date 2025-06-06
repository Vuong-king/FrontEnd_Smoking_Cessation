import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Outlet } from "react-router-dom";
import "antd/dist/reset.css";

// Layout
import { Navbar } from "./layouts/Navbar";
import { Footer } from "./layouts/Footer";
import ScrollToTop from "./layouts/ScrolltoTop";
import UserLayout from "./layouts/user/UserLayout";
import { AuthProvider } from "./context/AuthContext";

// Pages
import HomePages from "./pages/generic/home/HomePage";
import AuthPage from "./pages/auth/AuthPage";
import NotFoundPage from "./pages/error/404Page";
import DashBoardUser from "./pages/user/DashBoardUser";
import BlogPages from "./pages/generic/blogs/BlogPages";

// ===== Layout Wrapper =====
const Layout = () => (
  <div className="min-h-screen bg-black text-white mt-20">
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);

// ===== App with Routing =====
function App() {
  return (
  
    <Router>
        <AuthProvider>
      <ScrollToTop />
      <Routes>
        {/* Auth route */}
        <Route path="/login" element={<AuthPage />} />

        {/* Main layout routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePages />} />
          <Route path="/blog" element={<BlogPages />} />
        </Route>

        {/* User routes */}
        <Route path="/user" element={<UserLayout />}>
          <Route path="dashboard" element={<DashBoardUser />} />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </AuthProvider>
    </Router>
    
  );
}

export default App;
