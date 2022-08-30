import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import axiosInstance from "../../utils/axiosInstance";

export const fetchAllAdminRooms = createAsyncThunk(
  "fetchAdminRooms",
  async ({ page = 1, search = "", limit = 10, type }, thunkapi) => {
    if (type === "search") {
      thunkapi.dispatch(searchTerm({ search }));
    }
    if (type === "pageChange") {
      thunkapi.dispatch(pageAndRows({ page: page, limit: limit }));
    }

    const RoomState = getAdminAllRoomsState(thunkapi.getState());

    let query;

    if (!RoomState.search) {
      query = `api/admin/room?page=${RoomState.page}&limit=${RoomState.limit}`;
    } else {
      query = `api/admin/room?page=${RoomState.page}&limit=${RoomState.limit}&search=${RoomState.search}`;
    }

    try {
      const { data } = await axiosInstance.get(query);
      return data;
    } catch (error) {
      return thunkapi.rejectWithValue(error.data.response);
    }
  }
);

export const deleteRoomById = createAsyncThunk(
  "deleteRoombyid",
  async ({ id }, thunkApi) => {
    try {
      const { data } = await axiosInstance.delete(`api/admin/room/${id}`);
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue("Error");
    }
  }
);

const AdminAllRoomsSlice = createSlice({
  name: "adminAllRooms",
  initialState: {
    page: 1,
    search: "",
    limit: 5,
    success: null,
    error: null,
    loading: false,
    isDeleted: null,
  },
  reducers: {
    searchTerm: (state, action) => {
      return {
        ...state,
        page: 1,
        limit: 5,
        search: action.payload.search,
      };
    },
    pageAndRows: (state, action) => {
      return {
        ...state,
        page: action.payload.page,
        limit: action.payload.limit,
      };
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.adminAllRooms,
      };
    },
    [fetchAllAdminRooms.pending]: (state, action) => {
      state.success = null;
      state.error = null;
      state.loading = true;
      state.isDeleted = null;
    },
    [fetchAllAdminRooms.fulfilled]: (state, action) => {
      state.success = action.payload;
      state.error = null;
      state.loading = false;
    },
    [fetchAllAdminRooms.rejected]: (state, action) => {
      state.success = null;
      state.error = action.payload;
      state.loading = false;
    },
    [deleteRoomById.pending]: (state, action) => {
      return {
        ...state,
        loading: true,
        isDeleted: null,
      };
    },
    [deleteRoomById.fulfilled]: (state, action) => {
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };
    },
    [deleteRoomById.rejected]: (state, action) => {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
  },
});

export default AdminAllRoomsSlice;
export const { searchTerm, pageAndRows } = AdminAllRoomsSlice.actions;

export const getAdminAllRoomsState = (state) => state.adminAllRooms;
