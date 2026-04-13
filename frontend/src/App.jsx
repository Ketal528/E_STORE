import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { fetchCategories } from "./redux/slices/categorySlice";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CollectionPage from "./pages/CollectionPage";
import ProductDetails from "./components/Products/ProductDetails";
import ChackOut from "./components/Cart/ChackOut";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminHomePage from "./pages/AdminHomePage";
import UserManagement from "./components/Admin/UserManagement";
import ProductManagement from "./components/Admin/ProductManagement";
import EditProductPage from "./components/Admin/EditProductPage";
import OrderManagement from "./components/Admin/OrderManagement";

import { Provider, useDispatch } from "react-redux";
import store from "./redux/store";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import AddProduct from "./components/Admin/AddProduct";
import CategoryManagement from "./components/Admin/CategoryManagement";
import AddCategory from "./components/Admin/AddCategory";

const App = () => {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   // Fetch categories globally when the app starts
  //   dispatch(fetchCategories());

  //   // If you have a fetchProducts action, dispatch it here too
  //   // dispatch(fetchProducts());
  // }, [dispatch]);
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* user layout */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
            <Route path="collection/:collection" element={<CollectionPage />} />
            <Route path="collection" element={<CollectionPage />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="checkOut" element={<ChackOut />} />
            <Route
              path="order-confirmation"
              element={<OrderConfirmationPage />}
            />
            <Route path="order/:id" element={<OrderDetailsPage />} />
            <Route path="/my-orders" element={<MyOrdersPage />} />
          </Route>
          {/* Admin layout */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHomePage />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="categories/add" element={<AddCategory />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="/admin/products/category/:categoryName" element={<ProductManagement />} />v
            <Route path="products/create" element={<AddProduct />} />
            <Route path="products/:id/edit" element={<EditProductPage />} />
            <Route path="orders" element={<OrderManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
