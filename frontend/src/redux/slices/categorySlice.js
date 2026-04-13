import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API URL - Adjust this to match your backend
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/admin/categories`;

// 1. Fetch all categories
export const fetchCategories = createAsyncThunk(
    "category/fetchCategories",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL);
            return response.data; // Assumes your API returns an array or {categories: []}
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// 2. Add a new category (Admin only)
export const createCategory = createAsyncThunk(
    "category/createCategory",
    async (categoryData, { rejectWithValue }) => {
        try {
            // Assumes you have your auth token in localStorage or similar
            const token = localStorage.getItem("userToken");
            const response = await axios.post(API_URL, categoryData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteCategory = createAsyncThunk(
    "category/deleteCategory",
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("userToken");
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return id; // Return the ID so we can remove it from state
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const categorySlice = createSlice({
    name: "category",
    initialState: {
        categories: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetching categories
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Creating categories
            .addCase(createCategory.fulfilled, (state, action) => {
                state.categories.push(action.payload);
            })
            // Add this case to extraReducers in categorySlice.js
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter((cat) => cat._id !== action.payload);
            });

    },
});



export default categorySlice.reducer;