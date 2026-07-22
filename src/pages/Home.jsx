import React, { useState } from "react";
import Hero from "../components/Hero/Hero";
import Categories from "../components/Categories/Categories";
import ProductGrid from "../components/ProductGrid/ProductGrid";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");

  const handleSelectCategory = (category) => {
    setActiveCategory(category);
  };

  return (
    <div className="flex-grow">
      {/* 1. Hero Banner */}
      <Hero />

      {/* 2. Categories Filtering Panel */}
      <Categories 
        activeCategory={activeCategory} 
        onSelectCategory={handleSelectCategory} 
      />

      {/* 3. Interactive Product Grid (Search + Cards) */}
      <ProductGrid 
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
      />
    </div>
  );
}
