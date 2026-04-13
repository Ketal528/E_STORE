import React, { useState } from 'react'
import { FaBars } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';
import { Outlet } from 'react-router-dom';

function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
        {/* mobile toggle button */}
        <div className="flex md:hidden p-4 bg-gray-900 text-white">
            <button onClick={toggleSidebar}>
                <FaBars size={24}/>
            </button>
            <h1 className="ml-4 text-xl font-medium">Admin Dashbord</h1>
        </div>

        {/* overlay for mobile sidebar */}
        {isSidebarOpen && (
            <div className="fixed inset-0 z-10 bg-black/50 md:hidden" onClick={toggleSidebar}>

            </div>
        )}

        {/* sidebar */}
        <div className={`bg-gray-900 w-64 text-white z-20
                fixed inset-y-0 left-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0 md:static
                md:h-screen md:sticky md:top-0`}>
            {/* sidebar */}
            <AdminSidebar/>
        </div>

        {/* Main Content */}
        <div className="flex-grow p-6 overflow-auto">
            <Outlet />
        </div>
    </div>
  )
}

export default AdminLayout