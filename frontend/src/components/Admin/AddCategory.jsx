import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createCategory } from "../../redux/slices/categorySlice";

function AddCategory() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(createCategory({ name, description }))
      .unwrap()
      .then(() => navigate("/admin/categories"))
      .catch((error) => {
        alert(error.message || "Failed to create category");
      });
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-6">Create New Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Electronics"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-gray-900 outline-none"
            required
          />
        </div>

        {/* Added Description Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Category description..."
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-gray-900 outline-none"
            rows="3"
          />
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            className="flex-grow bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 transition"
          >
            Create Category
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCategory;
