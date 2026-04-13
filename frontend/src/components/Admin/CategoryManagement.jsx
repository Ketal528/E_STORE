import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrashAlt, FaEdit } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux'; // Added
import { fetchCategories, deleteCategory } from '../../redux/slices/categorySlice';

function CategoryManagement() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Get real data from Redux
    const { categories, loading, error } = useSelector((state) => state.category);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            dispatch(deleteCategory(id));
            
        }
    };

    if (loading) return <div className="text-center p-10 text-green-500">Loading categories...</div>;
    if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Category Management</h1>
                <button 
                    onClick={() => navigate('/admin/categories/add')}
                    className="bg-gray-900 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-gray-800 transition"
                >
                    <FaPlus />
                    <span>Add Category</span>
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discription</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories.map((category) => (
                            <tr key={category._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.slug}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{category.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-blue-600 hover:text-blue-900 mr-4"><FaEdit /></button>
                                    <button 
                                        onClick={() => handleDelete(category._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CategoryManagement;