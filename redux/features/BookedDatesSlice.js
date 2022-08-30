import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import axiosInstance from "../../utils/axiosInstance";

export const fetchBookedDates = createAsyncThunk(
  "fetchBookedDates",
  async (roomId, thunkApi) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/booking/bookedDates?roomId=${roomId}`
      );
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

const BookedDatesSlice = createSlice({
  name: "bookedDates",
  initialState: {
    dates: null,
    error: null,
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.bookedDates,
      };
    },
    [fetchBookedDates.pending]: (state, action) => {
      state.dates = null;
      state.error = null;
    },
    [fetchBookedDates.fulfilled]: (state, action) => {
      state.dates = action.payload;
      state.error = null;
    },
    [fetchBookedDates.rejected]: (state, action) => {
      state.dates = null;
      state.error = action.payload;
    },
  },
});

export default BookedDatesSlice;

export const getBookedDatesState = (state) => state.bookedDates;
