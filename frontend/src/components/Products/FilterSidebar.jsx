import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/slices/categorySlice";

function FilterSidebar() {
  const GENDERS = ["Kids","Boy", "Girl", "Men", "Women", "Unisex"];

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Pull dynamic data from Redux Store
  const { categories } = useSelector((state) => state.category);
  const { products } = useSelector((state) => state.products);

  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 100,
  });

  const [priceRang, setPriceRange] = useState([0, 100]);

  // State to hold unique filter options extracted from products
  const [dynamicOptions, setDynamicOptions] = useState({
    colors: [],
    brands: [],
    materials: [],
    sizes: [],
    genders: [],
  });

  const initialFilters = {
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 1000, // Matching your max range
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setPriceRange([0, 1000]);
    setSearchParams({}); // This clears the URL ?category=... etc.
    navigate(window.location.pathname); // Navigates to the same page without params
  };

  useEffect(() => {
    // Only fetch if we don't already have categories
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories]);

  const COLOR_MAP = {
  "Black": "#000000",
  "White": "#FFFFFF",
  "Red": "#FF0000",
  "Blue": "#0000FF",
  "Green": "#008000",
  "Yellow": "#FFFF00",
  "Gray": "#808080",
  "Pink": "#FFC0CB",
  "Purple": "#800080",
  "Orange": "#FFA500",
  "Brown": "#A52A2A",
  "Navy Blue": "#000080",
  "Cream": "#FFFDD0",
  "Vine Red": "#722F37",
  "Beige": "#F5F5DC"
};

const FIXED_COLORS = Object.keys(COLOR_MAP);

  // 2. Extract unique values whenever products list changes
useEffect(() => {
  if (products && products.length > 0) {
    const getUnique = (field) => [
      ...new Set(products.map((p) => p[field]).filter(Boolean)),
    ];

    setDynamicOptions((prev) => ({
      ...prev,
      colors: FIXED_COLORS, // Always use the fixed list
      brands: getUnique("brand"),
      materials: getUnique("material"),
      genders: getUnique("gender"),
      sizes: [...new Set(products.flatMap((p) => p.sizes || []).filter(Boolean))],
    }));
  }
}, [products]);

  // 3. Sync local filters with URL parameters on mount/URL change
  useEffect(() => {
    const parems = Object.fromEntries([...searchParams]);

    setFilters({
      category: parems.category || "",
      gender: parems.gender || "",
      color: parems.color || "",
      size: parems.size ? parems.size.split(",") : [],
      material: parems.material ? parems.material.split(",") : [],
      brand: parems.brand ? parems.brand.split(",") : [],
      minPrice: parems.minPrice || 0,
      maxPrice: parems.maxPrice || 100,
    });

    setPriceRange([0, parems.maxPrice || 100]);
  }, [searchParams]);

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    let newFilters = { ...filters };

    if (type === "checkbox") {
      if (checked) {
        newFilters[name] = [...(newFilters[name] || []), value];
      } else {
        newFilters[name] = newFilters[name].filter((item) => item !== value);
      }
    } else {
      newFilters[name] = value;
    }
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.append(key, newFilters[key].join(","));
      } else if (newFilters[key]) {
        params.append(key, newFilters[key]);
      }
    });
    setSearchParams(params);
    navigate(`?${params.toString()}`);
  };

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setPriceRange([0, newPrice]);
    const newFilters = { ...filters, minPrice: 0, maxPrice: newPrice };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium text-gray-600">Filter</h3>
        <button
          onClick={handleClearFilters}
          className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
        >
          Clear Filter
        </button>
      </div>

      {/* Dynamic Category filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Category</label>
        {categories?.map((cat) => (
          <div key={cat._id} className="flex items-center mb-1">
            <input
              type="radio"
              name="category"
              value={cat.name}
              onChange={handleFilterChange}
              checked={filters.category === cat.name}
              className="mr-2 h-4 w-4 text-blue-500 border-gray-300 cursor-pointer"
            />
            <span className="text-gray-700">{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Dynamic Gender filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Gender</label>
        <div className="flex items-center mb-1">
          <input
            type="radio"
            name="gender"
            value="" // Empty value means no filter
            onChange={handleFilterChange}
            checked={filters.gender === ""}
            className="mr-2 h-4 w-4 text-blue-500 border-gray-300 cursor-pointer"
          />
          <span className="text-gray-700 font-medium">All</span>
        </div>
        {GENDERS.map((gender) => (
          <div key={gender} className="flex items-center mb-1">
            <input
              type="radio"
              name="gender"
              value={gender}
              onChange={handleFilterChange}
              checked={filters.gender === gender}
              className="mr-2 h-4 w-4 text-blue-500 border-gray-300 cursor-pointer"
            />
            <span className="text-gray-700">{gender}</span>
          </div>
        ))}
      </div>

{/* Fixed Color Filter */}
<div className="mb-6">
  <label className="block text-gray-600 font-medium mb-2">Color</label>
  <div className="flex flex-wrap gap-2">
    {dynamicOptions.colors.map((color) => (
      <button
        key={color}
        type="button"
        onClick={() =>
          handleFilterChange({
            target: { name: "color", value: color, type: "button" },
          })
        }
        title={color}
        className={`w-8 h-8 rounded-full border transition hover:scale-110 
          ${filters.color === color ? "ring-2 ring-blue-500 ring-offset-2" : "border-gray-300"}
        `}
        style={{ 
          backgroundColor: COLOR_MAP[color] || color.toLowerCase(),
          // Adds a tiny shadow for white/cream so they don't blend into the page
          boxShadow: "inset 0 0 1px rgba(0,0,0,0.2)" 
        }}
      />
    ))}
  </div>
</div>

      {/* Dynamic Size filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Size</label>
        {dynamicOptions.sizes.map((size) => (
          <div key={size} className="flex items-center mb-1">
            <input
              type="checkbox"
              name="size"
              value={size}
              onChange={handleFilterChange}
              checked={filters.size.includes(size)}
              className="mr-2 h-4 w-4 text-blue-500 border-gray-300 cursor-pointer"
            />
            <span className="text-gray-700">{size}</span>
          </div>
        ))}
      </div>

      {/* Dynamic Material filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Material</label>
        {dynamicOptions.materials.map((material) => (
          <div key={material} className="flex items-center mb-1">
            <input
              type="checkbox"
              name="material"
              value={material}
              onChange={handleFilterChange}
              checked={filters.material.includes(material)}
              className="mr-2 h-4 w-4 text-blue-500 border-gray-300 cursor-pointer"
            />
            <span className="text-gray-700">{material}</span>
          </div>
        ))}
      </div>

      {/* Dynamic Brand filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Brand</label>
        {dynamicOptions.brands.map((brand) => (
          <div key={brand} className="flex items-center mb-1">
            <input
              type="checkbox"
              name="brand"
              value={brand}
              onChange={handleFilterChange}
              checked={filters.brand.includes(brand)}
              className="mr-2 h-4 w-4 text-blue-500 border-gray-300 cursor-pointer"
            />
            <span className="text-gray-700">{brand}</span>
          </div>
        ))}
      </div>

      {/* Price Range filter */}
      <div className="mb-8">
        <label className="block text-gray-600 font-medium mb-2">
          Price Range (Up to ${priceRang[1]})
        </label>
        <input
          type="range"
          min={0}
          max={1000} // Increased max to 1000 for better utility
          value={priceRang[1]}
          onChange={handlePriceChange}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-gray-600 mt-2 text-sm">
          <span>$0</span>
          <span>${priceRang[1]}</span>
        </div>
      </div>

      {/* Alternative: Large button at the bottom */}
      <button
        onClick={handleClearFilters}
        className="w-full py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
      >
        Reset All Filters
      </button>
    </div>
  );
}

export default FilterSidebar;
