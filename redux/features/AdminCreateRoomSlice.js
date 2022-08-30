import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import axiosInstance from "../../utils/axiosInstance";

export const createRoomThunk = createAsyncThunk(
  "createRoomThunk",
  async (roomData, thunkApi) => {
    console.log(roomData);

    try {
      const { data } = await axiosInstance.post("/api/admin/room", roomData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

const AdminCreateRoomSlice = createSlice({
  name: "createRoom",
  initialState: {
    success: null,
    loading: false,
    error: null,
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.createRoom,
      };
    },

    [createRoomThunk.pending]: (state, action) => {
      state.success = null;
      state.loading = true;
      state.error = null;
    },

    [createRoomThunk.fulfilled]: (state, action) => {
      state.success = action.payload;
      state.loading = false;
      state.error = null;
    },
    [createRoomThunk.rejected]: (state, action) => {
      state.success = null;
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default AdminCreateRoomSlice;

export const getAdminCreateRoomState = (state) => state.createRoom;
