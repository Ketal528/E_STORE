import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  deleteProduct,
  fetchAdminProducts,
} from "../../redux/slices/adminProductSlice";

function ProductManagement() {
  const dispatch = useDispatch();
  const { categoryName } = useParams();
  const { products, loading, error } = useSelector(
    (state) => state.adminProducts,
  );

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete the Product?")) {
      dispatch(deleteProduct(id));
    }
  };

  // --- Logic to filter products based on the URL ---
  const filteredProducts = categoryName
    ? products.filter((product) => {
        // Decode the URL (turns "bottom%20wear" back into "bottom wear")
        const decodedCategory = decodeURIComponent(categoryName).toLowerCase();

        // Check if product.category is a string or an object
        const productCatName =
          typeof product.category === "object"
            ? product.category.name
            : product.category;

        return productCatName?.toLowerCase() === decodedCategory;
      })
    : products;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  console.log("URL Category:", categoryName);
console.log("First Product Category:", products[0]?.category);
console.log("Filtered Count:", filteredProducts.length);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section with Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {categoryName ? `${categoryName} Products` : "Product Management"}
        </h2>
        <Link
          to="/admin/products/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Product
        </Link>
      </div>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr
                  key={product._id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-4">
                    <img
                      src={
                        product.images?.[0]?.url ||
                        "https://via.placeholder.com/50"
                      }
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md shadow-sm"
                    />
                  </td>
                  <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                    {product.name}
                  </td>
                  <td className="p-4">${product.price}</td>
                  <td className="p-4">${product.sku}</td>
                  <td className="p-4">
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </Link>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500 ">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductManagement;
