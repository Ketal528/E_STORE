import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../redux/slices/adminProductSlice";
import axios from "axios";

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.adminProducts);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "", // Added this
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: [],
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    dimensions: { length: 0, width: 0, height: 0 },
    weight: 0,
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes("dimensions.")) {
      const field = name.split(".")[1];
      setProductData((prev) => ({
        ...prev,
        dimensions: { ...prev.dimensions, [field]: value },
      }));
    } else {
      setProductData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      setProductData((prevData) => ({
        ...prevData,
        images: [...prevData.images, { url: data.imageUrl, altText: "" }],
      }));
      setUploading(false);
    } catch (error) {
      console.error("Image upload failed:", error);
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setProductData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(createProduct(productData));
    navigate("/admin/products");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md bg-white">
      <h2 className="text-3xl font-bold mb-6">Add New Product</h2>
      {error && <p className="text-red-500 mb-4 font-medium">Error: {error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-6">
          <label className="block font-bold mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            rows={4}
            required
          />
        </div>

        {/* Prices & Stock */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <label className="block font-semibold mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Discount Price</label>
            <input
              type="number"
              name="discountPrice"
              value={productData.discountPrice}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Count In Stock</label>
            <input
              type="number"
              name="countInStock"
              value={productData.countInStock}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">SKU</label>
            <input
              type="text"
              name="sku"
              value={productData.sku}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
        </div>

        {/* Category & Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-semibold mb-2">Category</label>
            <input
              type="text"
              name="category"
              placeholder="e.g., Top Wear"
              value={productData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Brand</label>
            <input
              type="text"
              name="brand"
              placeholder="e.g., Beach Breeze"
              value={productData.brand}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
        </div>

        {/* Sizes & Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-semibold mb-2">
              Sizes (comma-separated)
            </label>
            <input
              type="text"
              placeholder="S, M, L, XL"
              onChange={(e) =>
                setProductData({
                  ...productData,
                  sizes: e.target.value.split(",").map((s) => s.trim()),
                })
              }
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">
              Colors (comma-separated)
            </label>
            <input
              type="text"
              placeholder="Tropical Print, Navy Palms"
              onChange={(e) =>
                setProductData({
                  ...productData,
                  colors: e.target.value.split(",").map((c) => c.trim()),
                })
              }
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        {/* Visibility & Features */}
        <div className="flex gap-6 mb-6">
          <label className="flex items-center">
            <input type="checkbox" name="isFeatured" checked={productData.isFeatured} onChange={handleChange} className="mr-2" />
            Featured Product
          </label>
          <label className="flex items-center">
            <input type="checkbox" name="isPublished" checked={productData.isPublished} onChange={handleChange} className="mr-2" />
            Published
          </label>
        </div>

        {/* Dimensions & Weight */}
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Physical Attributes</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <label className="block font-semibold mb-2">Weight (kg)</label>
            <input type="number" name="weight" value={productData.weight} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div>
            <label className="block font-semibold mb-2">Length</label>
            <input type="number" name="dimensions.length" value={productData.dimensions.length} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div>
            <label className="block font-semibold mb-2">Width</label>
            <input type="number" name="dimensions.width" value={productData.dimensions.width} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div>
            <label className="block font-semibold mb-2">Height</label>
            <input type="number" name="dimensions.height" value={productData.dimensions.height} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
          </div>
        </div>

        {/* SEO Metadata */}
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">SEO Metadata</h3>
        <div className="mb-6">
          <label className="block font-semibold mb-2">Meta Title</label>
          <input type="text" name="metaTitle" value={productData.metaTitle} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-2">Meta Description</label>
          <textarea name="metaDescription" value={productData.metaDescription} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" rows={2} />
        </div>

        {/* Collection, Material, Gender */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block font-semibold mb-2">Collection</label>
            <input
              type="text"
              name="collections"
              value={productData.collections}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Material</label>
            <input
              type="text"
              name="material"
              placeholder="e.g., Viscose"
              value={productData.material}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Gender</label>
            <select
              name="gender"
              value={productData.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Select Gender</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Upload Images</label>
          <input type="file" onChange={handleImageUpload} />
          {uploading && <p className="text-blue-500 mt-2">Uploading...</p>}
          <div className="flex gap-4 mt-4">
            {productData.images.map((img, index) => (
              <div className="relative">
                <img
                  key={index}
                  src={img.url}
                  alt="Product Preview"
                  className="w-20 h-20 object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {loading ? "Creating Product..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
