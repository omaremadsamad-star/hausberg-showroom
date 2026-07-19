import React from "react";
import { useParams } from "react-router-dom";

export default function ProductDetails() {
  const { productId } = useParams();
  return (
    <div className="p-8 text-center text-white">
      <h1 className="text-3xl font-bold">Product Details Page</h1>
      <p className="mt-4 text-neutral-400">Viewing product with ID: {productId}</p>
    </div>
  );
}
