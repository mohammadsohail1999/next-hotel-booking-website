import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import axiosInstance from "../../utils/axiosInstance";

export const checkBookingAvaibility = createAsyncThunk(
  "checkBookingAvaiblity",
  async ({ checkInandOut, roomId }, thunkApi) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/booking/check?checkInDate=${checkInandOut[0]}&checkOutDate=${checkInandOut[1]}&roomId=${roomId}`
      );
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

const checkBookingSlice = createSlice({
  name: "bookingCheck",
  initialState: {
    success: null,
    error: null,
    loading: false,
  },
  reducers: {
    reset: (state, action) => {
      state.success = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.bookingCheck,
      };
    },
    [checkBookingAvaibility.pending]: (state, action) => {
      state.loading = true;
      state.success = null;
      state.error = null;
    },
    [checkBookingAvaibility.fulfilled]: (state, action) => {
      state.loading = false;
      state.success = action.payload;
      state.error = null;
    },
    [checkBookingAvaibility.pending]: (state, action) => {
      state.loading = false;
      state.success = null;
      state.error = action.payload;
    },
  },
});

export default checkBookingSlice;

export const getBookingCheckState = (state) => state.bookingCheck;
