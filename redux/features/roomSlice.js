import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import axiosInstance from "../../utils/axiosInstance";

export const fetchAllRooms = createAsyncThunk(
  "rooms/fetchAllrooms",
  async (query, thunkApi) => {
    let apiStr = "/api/rooms";

    if (query) {
      if (query.page) {
        apiStr = `/api/rooms?page=${query.page}`;
      }
    }

    try {
      const { data } = await axiosInstance.get(apiStr);
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

const roomSlice = createSlice({
  name: "rooms",
  initialState: {
    rooms: [],
    error: null,
  },
  reducers: {
    fetchRooms: (state, action) => {},
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.rooms,
      };
    },
    [fetchAllRooms.pending]: (state, action) => {
      state.error = null;
    },
    [fetchAllRooms.rejected]: (state, action) => {
      state.error = action.payload;
    },
    [fetchAllRooms.fulfilled]: (state, action) => {
      state.rooms = action.payload.rooms;
      state.roomCount = action.payload.roomCount;
      state.resPerPage = action.payload.resPerPage;
      state.filteredRoomsCount = action.payload.filteredRoomsCount;
      state.error = null;
    },
  },
});

export default roomSlice;

export const getRoomState = (state) => state.rooms;
