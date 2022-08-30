import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import axiosInstance from "../../utils/axiosInstance";

export const getForgotPasswordToken = createAsyncThunk(
  "forgotPassword/token",
  async (email, thunkApi) => {
    try {
      const { data } = await axiosInstance.post("/api/forgetPassword", {
        email,
      });

      console.log(data);
      return data;
    } catch (error) {
      console.dir(error);
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

const forgetPasswordSlice = createSlice({
  name: "forgetPassword",
  initialState: {
    success: null,
    loading: false,
    error: null,
  },
  reducers: {
    reset: (state, action) => {
      state.error = null;
      state.loading = false;
      state.success = null;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.forgetPassword,
      };
    },
    [getForgotPasswordToken.pending]: (state, action) => {
      state.loading = true;
      state.success = null;
      state.error = null;
    },
    [getForgotPasswordToken.fulfilled]: (state, action) => {
      state.loading = false;
      state.success = action.payload;
      state.error = null;
    },
    [getForgotPasswordToken.rejected]: (state, action) => {
      state.loading = false;
      state.success = null;
      state.error = action.payload;
    },
  },
});

export default forgetPasswordSlice;

export const { reset } = forgetPasswordSlice.actions;

export const getforgetPasswordState = (state) => state.forgetPassword;
