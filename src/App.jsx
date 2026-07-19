import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { LanguageProvider } from "./context/LanguageContext";

import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import About from "./pages/About";

function AppContent() {
  return (
    <div className="relative min-h-screen bg-[#07070a] text-neutral-100 selection:bg-brand selection:text-black overflow-x-hidden flex flex-col justify-between">
      {/* Header Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
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
      <AppContent />
    </LanguageProvider>
  );
}
