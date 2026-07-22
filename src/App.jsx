import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { LanguageProvider } from "./context/LanguageContext";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import About from "./pages/About";

// Admin Imports
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts from "./admin/AdminProducts";
import AdminCategories from "./admin/AdminCategories";
import AdminSettings from "./admin/AdminSettings";
import AdminManagers from "./admin/AdminManagers";
import AdminSecurity from "./admin/AdminSecurity";
import AdminBackups from "./admin/AdminBackups";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <main className="min-h-screen bg-[#07070a] text-neutral-100 selection:bg-brand selection:text-black flex flex-col justify-between">
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/admins" element={<AdminManagers />} />
            <Route path="/admin/logs" element={<AdminSecurity />} />
            <Route path="/admin/blocked-ips" element={<AdminSecurity activeTab="ips" />} />
            <Route path="/admin/backups" element={<AdminBackups />} />
          </Route>
        </Routes>
      </main>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#07070a] text-neutral-100 selection:bg-brand selection:text-black overflow-x-hidden flex flex-col justify-between">
      {/* Header Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      {/* Footer Brand Information */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </AppProvider>
    </LanguageProvider>
  );
}
