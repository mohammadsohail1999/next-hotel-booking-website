import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import axiosInstance from "../../utils/axiosInstance";

export const loadUser = createAsyncThunk(
  "loadUser/getUser",
  async (undefined, thunkApi) => {
    try {
      const { data } = await axiosInstance.get("/api/me");
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  "loadUser/updateUser",
  async (newUserData, thunkApi) => {
    try {
      const { data } = await axiosInstance.put("/api/me", newUserData);
      console.log(data);
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

const loadUserSlice = createSlice({
  name: "loadUser",
  initialState: {
    loading: true,
    user: null,
    isAuthenticated: false,
    error: null,
    isUpdated: false,
  },
  reducers: {},
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.loadUser,
      };
    },
    [loadUser.pending]: (state, action) => {
      state.loading = true;
      state.user = null;
      state.error = null;
      state.isAuthenticated = false;
      state.isUpdated = false;
    },
    [loadUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.error = null;
      state.isAuthenticated = true;
      state.isUpdated = false;
    },
    [loadUser.rejected]: (state, action) => {
      state.loading = false;
      state.user = null;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.isUpdated = false;
    },
    [updateUser.pending]: (state, action) => {
      return {
        ...state,
        isUpdated: false,
      };
    },
    [updateUser.fulfilled]: (state, action) => {
      return {
        ...state,
        isUpdated: true,
        loading: false,
      };
    },
    [updateUser.rejected]: (state, action) => {
      return {
        ...state,
        loading: false,
        isUpdated: false,
        error: action.payload,
      };
    },
  },
});

export default loadUserSlice;

export const getLoadedUserState = (state) => state.loadUser;
