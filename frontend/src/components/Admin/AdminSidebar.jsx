import React, { useEffect, useState } from 'react'
import { FaBoxOpen, FaClipboardList, FaSignOutAlt, FaStore, FaUser, FaTags, FaChevronDown, FaChevronRight } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logout } from "../../redux/slices/authSlice";
import { clearCart } from "../../redux/slices/cartSlice";
import { fetchCategories } from "../../redux/slices/categorySlice";

function AdminSidebar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isProductOpen, setIsProductOpen] = useState(false);
    
        // Mock categories - Replace with your dynamic data if needed
    const { categories } = useSelector((state) => state.category);

    useEffect(() => {
        if(!categories || categories.length === 0 ){
            dispatch(fetchCategories());
        }
    },[dispatch, categories])

    // Define the missing linkStyle here
    const linkStyle = ({ isActive }) => 
        isActive 
            ? "bg-gray-700 text-white px-4 py-3 rounded flex items-center space-x-2" 
            : "text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-3 rounded flex items-center space-x-2";


    
    const hendleLogout = () => {
        dispatch(logout());
        dispatch(clearCart());
        navigate("/");
    };

  return (
    <div className="p-6">
        <div className="mb-6">
            <Link to="/admin" className="text-2xl font-medium" >Rabbit</Link>
        </div>
        <h2 className="text-xl font-medium mb-6 text-center">Admin Dashboard</h2>

        <nav className="flex flex-col space-y-2">
            <NavLink to="/admin/users" className={({isActive}) => isActive ? "bg-gray-700 text-white px-4 py-3 rounded flex items-center space-x-2" : "text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-3 rounded flex items-center space-x-2"}>
                <FaUser/>
                <span>User</span>
            </NavLink>

            {/* Category Section */}
            <NavLink to="/admin/categories" className={({isActive}) => isActive ? "bg-gray-700 text-white px-4 py-3 rounded flex items-center space-x-2" : "text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-3 rounded flex items-center space-x-2"}>
                <FaTags/>
                <span>Categories</span>
            </NavLink>

            {/* Products with Dropdown */}
            <div>
                <button 
                    onClick={() => setIsProductOpen(!isProductOpen)}
                    className="w-full text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-3 rounded flex items-center justify-between"
                >
                    <div className="flex items-center space-x-2">
                        <FaBoxOpen />
                        <span>Products</span>
                    </div>
                    {isProductOpen ? <FaChevronDown size={12}/> : <FaChevronRight size={12}/>}
                </button>

                {isProductOpen && (
                    <div className="ml-6 flex flex-col border-l border-gray-700">
                        <NavLink to="/admin/products" end className={({isActive}) => isActive ? "bg-gray-700 text-white px-4 py-3 rounded flex items-center space-x-2" : "text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-3 rounded flex items-center space-x-2"}>
                            <span className="text-sm">View All</span>
                        </NavLink>
                        {categories && categories.map((cat) => (
                            <NavLink 
                                key={cat._id}
                                // encodeURIComponent handles spaces and special characters like & or /
                                to={`/admin/products/category/${encodeURIComponent(cat.name.toLowerCase())}`} 
                                className={linkStyle}
                            >
                                <span className="text-sm">{cat.name}</span>
                            </NavLink>
                        ))}
                    </div>
                )}
            </div>

            <NavLink to="/admin/orders" className={({isActive}) => isActive ? "bg-gray-700 text-white px-4 py-3 rounded flex items-center space-x-2" : "text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-3 rounded flex items-center space-x-2"}>
                <FaClipboardList/>
                <span>Orders</span>
            </NavLink>

            <NavLink to="/" className={({isActive}) => isActive ? "bg-gray-700 text-white px-4 py-3 rounded flex items-center space-x-2" : "text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-3 rounded flex items-center space-x-2"}>
                <FaStore />
                <span>Shop</span>
            </NavLink>
        </nav>

        <div className="mt-6">
            <button onClick={hendleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center space-x-2">
                <FaSignOutAlt />    
                <span>Logout</span>
            </button>
        </div>
    </div>
  )
}

export default AdminSidebar