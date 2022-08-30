import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import axiosInstance from "../../utils/axiosInstance";

export const ResetPasswordAction = createAsyncThunk(
  "resetPassword/action",
  async (ResetPassData, thunkApi) => {
    try {
      const { data } = await axiosInstance.post(
        `/api/resetPassword?token=${ResetPassData?.token}`,
        {
          password: ResetPassData?.password,
          passwordConfirm: ResetPassData?.passwordConfirm,
        }
      );
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

const resetPasswordSlice = createSlice({
  name: "resetPassword",
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
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.resetPassword,
      };
    },
    [ResetPasswordAction.pending]: (state, action) => {
      state.loading = true;
      state.success = null;
      state.error = null;
    },
    [ResetPasswordAction.fulfilled]: (state, action) => {
      state.loading = false;
      state.success = action.payload;
      state.error = null;
    },
    [ResetPasswordAction.rejected]: (state, action) => {
      state.loading = false;
      state.success = null;
      state.error = action.payload;
    },
  },
});

export default resetPasswordSlice;

export const { reset } = resetPasswordSlice.actions;

export const getResetPasswordState = (state) => state.resetPassword;
