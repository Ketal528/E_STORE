import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MyOrdersPage from "./MyOrdersPage";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";
import { logout } from "../redux/slices/authSlice";
import { updatePassword } from "../redux/slices/authSlice";

const Profile = () => {
  const { user, loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Local state for password update
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(updatePassword(passwordData));

    if (updatePassword.fulfilled.match(resultAction)) {
      alert("Password updated in database successfully!");
      setPasswordData({ currentPassword: "", newPassword: "" });
      setShowPasswordForm(false);
    } else {
      alert(resultAction.payload || "Failed to update password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          {/* Left Section: User Info & Password Update */}
          <div className="w-full md:w-1/3 lg:w-1/4 shadow-md rounded-lg p-6 bg-white self-start">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {user?.name}
            </h1>
            <p className="text-lg text-gray-600 mb-6">{user?.email}</p>

            <div className="border-t pt-4 mb-6">
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="w-full text-left text-blue-600 hover:underline mb-4 flex justify-between items-center"
              >
                {showPasswordForm ? "Cancel Update" : "Update Password"}
                <span>{showPasswordForm ? "−" : "+"}</span>
              </button>

              {showPasswordForm && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                  >
                    Save New Password
                  </button>
                </form>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>

          {/* Right Section: Order History */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <MyOrdersPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
