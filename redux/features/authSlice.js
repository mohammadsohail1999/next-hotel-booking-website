import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import axiosInstance from "../../utils/axiosInstance";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkApi) => {
    try {
      const { data } = await axiosInstance.post("/api/auth/register", userData);
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    success: null,
    error: null,
  },
  reducers: {
    resetRegister: (state, action) => {
      state.error = null;
      state.success = null;
      state.loading = false;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.auth,
      };
    },
    [registerUser.pending]: (state, action) => {
      state.loading = true;
      state.success = null;
      state.error = null;
    },
    [registerUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.success = action.payload;
      state.error = null;
    },
    [registerUser.rejected]: (state, action) => {
      state.loading = false;
      state.success = null;
      state.error = action.payload;
    },
  },
});

export default authSlice;

export const { resetRegister } = authSlice.actions;

export const getAuthState = (state) => state.auth;
