

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Outlet } from "react-router-dom";

// Layout



// Pages
import HomePages from "./pages/generic/home/HomePage";
import { Navbar } from "./layouts/Navbar";
import { Footer } from "./layouts/Footer";


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
      {/* <ScrollToTop /> */}
      <Routes>
        {/*  Route useuse layout */}
        {/* <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} /> */}

        {/*  Route not useuse layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePages />} />

          {/* 404 layout */}
          <Route
            path="*"
            element={
              <div className="text-center py-16 text-2xl">
                404 - Page Not Found
              </div>
            }
          />
        </Route>
        {/* Admin routes */}
        {/* <Route path='/admin/dashboard' element={<DashboardAdmin />} />
        <Route path='/admin/dashboard/user-management' element={<UserManagement />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
