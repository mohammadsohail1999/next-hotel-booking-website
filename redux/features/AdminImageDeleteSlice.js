import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const AdminDeleteRoomImage = createAsyncThunk(
  "deleleRoomAdminImage",
  async (query, thunkApi) => {
    const { public_id, roomId } = query;

    try {
      const { data } = await axiosInstance.patch(
        `/api/admin/deleteImage?public_id=${public_id}&roomId=${roomId}`
      );
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.data.response);
    }
  }
);

const DeleteImageSlice = createSlice({
  name: "adminDeleteRoomImage",
  initialState: {
    loading: false,
    success: null,
    error: null,
  },
  reducers: {
    reset: (state, action) => {
      state.loading = false;
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: {
    [AdminDeleteRoomImage.pending]: (state, action) => {
      state.loading = true;
      state.success = null;
      state.error = null;
    },
    [AdminDeleteRoomImage.fulfilled]: (state, action) => {
      state.loading = false;
      state.success = action.payload;
      state.error = null;
    },
    [AdminDeleteRoomImage.rejected]: (state, action) => {
      state.loading = false;
      state.success = null;
      state.error = action.payload;
    },
  },
});

export default DeleteImageSlice;

export const { reset } = DeleteImageSlice.actions;

export const getDeleteImageState = (state) => state.adminDeleteRoomImage;
