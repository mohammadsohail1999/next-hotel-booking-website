import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import axiosInstance from "../../utils/axiosInstance";

export const fetchBookingDetails = createAsyncThunk(
  "fetchBookingDetails",
  async ({ cookie, id }, thunkApi) => {
    try {
      const { data } = await axiosInstance.get(`/api/booking/${id}`, {
        headers: {
          cookie,
        },
      });
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

const BookingDetailSlice = createSlice({
  name: "bookingDetails",
  initialState: {
    success: null,
    error: null,
  },
  reducers: {},
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.bookingDetails,
      };
    },
    [fetchBookingDetails.pending]: (state, action) => {
      state.success = null;
      state.error = null;
    },
    [fetchBookingDetails.fulfilled]: (state, action) => {
      state.success = action.payload;
      state.error = null;
    },
    [fetchBookingDetails.rejected]: (state, action) => {
      state.success = null;
      state.error = action.payload;
    },
  },
});

export default BookingDetailSlice;

export const getBookingDetailState = (state) => state.bookingDetails;
