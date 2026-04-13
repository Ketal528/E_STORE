import React from "react";
import { Link } from "react-router-dom";

function ProductGrid({ product = [], loading, error }) {
  if(loading){
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>Error: {error} </p>;
  }
  return (
<div className="min-h-[500px]">
      {product.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {product.map((item) => (
            <Link key={item._id} to={`/product/${item._id}`} className="block group">
              <div className="bg-white p-4 rounded-lg">
                <div className="w-full h-96 mb-4 overflow-hidden rounded-lg">
                  <img
                    src={item.images[0]?.url || "placeholder.jpg"}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-sm mb-2 font-medium">{item.name}</h3>
                <p className="text-gray-500 font-medium text-sm">${item.price}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-20">No products found.</p>
      )}
    </div>
  );
}

export default ProductGrid;
