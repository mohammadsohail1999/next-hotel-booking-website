import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import axiosInstance from "../../utils/axiosInstance";

export const fetchRoomDetails = createAsyncThunk(
  "roomDetail/fetchRoomDetails",
  async (id, thunkApi) => {
    try {
      const { data } = await axiosInstance.get(`/api/rooms/${id}`);
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

const roomDetailSlice = createSlice({
  name: "roomDetail",
  initialState: {
    roomDetail: null,
    error: null,
  },
  reducers: {},
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.roomDetail,
      };
    },
    [fetchRoomDetails.pending]: (state, action) => {
      state.error = null;
      state.roomDetail = null;
    },
    [fetchRoomDetails.rejected]: (state, action) => {
      state.roomDetail = null;
      state.error = action.payload;
    },
    [fetchRoomDetails.fulfilled]: (state, action) => {
      state.roomDetail = action.payload;
      state.error = null;
    },
  },
});

export default roomDetailSlice;

export const getRoomDetailState = (state) => state.roomDetail;
