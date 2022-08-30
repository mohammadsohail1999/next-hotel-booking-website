import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import axiosInstance from "../../utils/axiosInstance";

export const updateAdminRoomThunk = createAsyncThunk(
  "AdminUpdateRoomThunk",
  async ({ id, roomData }, thunkApi) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/admin/room/${id}`,
        roomData
      );
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

const AdminUpdateRoomSlice = createSlice({
  name: "AdminUpdateRoom",
  initialState: {
    success: null,
    loading: false,
    error: null,
  },
  reducers: {
    AdminUpdateReset: (state, action) => {
      state.success = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.AdminUpdateRoomThunk,
      };
    },
    [updateAdminRoomThunk.pending]: (state, action) => {
      state.success = null;
      state.loading = true;
      state.error = null;
    },
    [updateAdminRoomThunk.fulfilled]: (state, action) => {
      state.success = action.payload;
      state.loading = false;
      state.error = null;
    },
    [updateAdminRoomThunk.rejected]: (state, action) => {
      state.success = null;
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default AdminUpdateRoomSlice;

export const getAdminUpdateState = (state) => state.AdminUpdateRoom;
export const { AdminUpdateReset } = AdminUpdateRoomSlice.actions;
