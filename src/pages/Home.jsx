import React, { useState } from "react";
import Hero from "../components/Hero/Hero";
import Categories from "../components/Categories/Categories";
import ProductGrid from "../components/ProductGrid/ProductGrid";
import ProductModal from "../components/ProductModal/ProductModal";
import { products } from "../data/products";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSelectCategory = (category) => {
    setActiveCategory(category);
  };

  const handleOpenDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
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
        products={products} 
        onViewDetails={handleOpenDetails} 
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* 4. Product Detail Modal overlay (Fallback preview) */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={handleCloseDetails} 
        />
      )}
    </div>
  );
}
