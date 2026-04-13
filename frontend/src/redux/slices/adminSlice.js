import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// fetch all users (admin only)
export const fetchUsers = createAsyncThunk(
    "admin/fetchUsers",
    async () => {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                }
            }
        );
        return response.data;
    }
);

// add the create user action
export const addUser = createAsyncThunk(
    "admin/addUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
                userData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// update user info
export const updateUser = createAsyncThunk(
    "admin/updateUser",
    async ({ id, name, email, role }) => {
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
            { name, email, role },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                }
            }
        );
        return response.data;
    }
);

// Delete a user
export const deleteUser = createAsyncThunk("admin/deleteUser", async (id) => {
    await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
        }
    );
    return id;
});

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            // update user
            .addCase(updateUser.fulfilled, (state, action) => {
                const updateUser = action.payload.user || action.payload;
                const userIndex = state.users.findIndex(
                    (user) => user._id === updateUser._id
                );
                if (userIndex !== -1) {
                    state.users[userIndex] = updateUser;
                }
            })
            // delete user
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter((user) => user._id !== action.payload);
            })

            // add user
            .addCase(addUser.pending, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false;
                // This safely checks if the user is nested or direct
                const newUser = action.payload.user || action.payload;

                // Only push if newUser actually exists and has data
                if (newUser && newUser.name) {
                    state.users.push(newUser);
                }
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export default adminSlice.reducer;