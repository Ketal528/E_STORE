import React, { useState } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProductsByFilters, setFilters } from "../../redux/slices/productsSlice";

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSerchToggle = () => {
    setIsOpen(!isOpen);
  };
  const handleSerch = (e) => {
    e.preventDefault();
    dispatch(setFilters({search: searchTerm}));
    dispatch(fetchProductsByFilters({search: searchTerm}));
    navigate(`/collection/all/?search=${searchTerm}`)
    setIsOpen(false);
  };

  return (
    <div
      className={`${
        isOpen
          ? "absolute top-0 left-0 w-full bg-white z-50 px-4"
          : "flex items-center"
      } flex items-center justify-center transition-all duration-300`}
    >
      {isOpen ? (
        <form
          onSubmit={handleSerch}
          className="flex items-center justify-center w-full max-w-xl mx-auto"
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search Products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-100 py-3 px-4 pr-12 rounded-lg focus:outline-none w-full text-black border border-gray-200"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
            >
              <HiMagnifyingGlass className="h-6 w-6" />
            </button>
          </div>

          {/* Close button - specifically for mobile accessibility */}
          <button
            onClick={handleSerchToggle}
            type="button"
            className="ml-4 p-2 text-gray-600 hover:text-black"
          >
            <HiMiniXMark className="h-7 w-7" />
          </button>
        </form>
      ) : (
        <button onClick={handleSerchToggle} className="p-2">
          <HiMagnifyingGlass className="h-6 w-6 text-gray-700 hover:text-black" />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
