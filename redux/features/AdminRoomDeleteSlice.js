// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { HYDRATE } from "next-redux-wrapper";
// import axiosInstance from "../../utils/axiosInstance";

// const deleteRoombyAdmin = createAsyncThunk(
//   "deleteRoom",
//   async (id, thunkapi) => {
//     try {
//       const { data } = await axiosInstance.delete(`/api/admin/rooms/${id}`);
//       return data;
//     } catch (error) {
//       return thunkapi.rejectWithValue(error.response.data);
//     }
//   }
// );

// const AdminRoomSlice = createSlice({
//   name: "deleteRoomAdmin",
//   initialState: {
//     loading: false,
//     success: null,
//     error: null,
//   },
//   extraReducers: {
//     [HYDRATE]: (state, action) => {
//       return {
//         ...state,
//         ...action.payload.deleteRoomAdmin,
//       };
//     },

//     [deleteRoombyAdmin.pending]: (state, action) => {
//       state.loading = true;
//       state.success = null;
//       state.error = null;
//     },
//     [deleteRoombyAdmin.fulfilled]: (state, action) => {
//       state.loading = false;
//       state.success = action.payload;
//       state.error = null;
//     },
//     [deleteRoombyAdmin.rejected]: (state, action) => {
//       state.loading = false;
//       state.success = null;
//       state.error = action.payload;
//     },
//   },
// });

// export default AdminDeleteRoomSlice;

// export const AdminDeleteRoomState = (state) => state.deleteRoomAdmin;
