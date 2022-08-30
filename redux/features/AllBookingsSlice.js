import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import axiosInstance from "../../utils/axiosInstance";

export const fetchAllBookings = createAsyncThunk(
  "getAllBookings",
  async ({ limit = 10, page = 1 }, thunkApi) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/booking?page=${page}&limit=${limit}`
      );
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

const AllBookingSlice = createSlice({
  name: "AllBookings",
  initialState: {
    success: null,
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.AllBookings,
      };
    },
    [fetchAllBookings.pending]: (state, action) => {
      state.loading = true;
      state.success = null;
      state.error = null;
    },
    [fetchAllBookings.fulfilled]: (state, action) => {
      state.loading = false;
      state.success = action.payload;
      state.error = null;
    },
    [fetchAllBookings.rejected]: (state, action) => {
      state.loading = false;
      state.success = null;
      state.error = action.payload;
    },
  },
});

export default AllBookingSlice;

export const getAllBookingsState = (state) => state.AllBookings;
