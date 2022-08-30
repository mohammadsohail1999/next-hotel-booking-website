import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { setupListeners } from "@reduxjs/toolkit/query";
import BookitApi from "../services/BookitApi";
import AdminAllRoomsSlice from "./features/AdminAllRoomsSlice";
import AdminCreateRoomSlice from "./features/AdminCreateRoomSlice";
import DeleteImageSlice from "./features/AdminImageDeleteSlice";
import AdminUpdateRoomSlice from "./features/AdminUpdateRoomSlice";
import AllBookingSlice from "./features/AllBookingsSlice";
import authSlice from "./features/authSlice";
import BookedDatesSlice from "./features/BookedDatesSlice";
import BookingDetailSlice from "./features/BookingDetailSlice";
import checkBookingSlice from "./features/CheckBookingSlice";
import forgetPasswordSlice from "./features/forgetPasswordSlice";
import loadUserSlice from "./features/loadUserSlice";
import resetPasswordSlice from "./features/resetPasswordSlice";
import roomDetailSlice from "./features/roomDetailsSlice";
import roomSlice from "./features/roomSlice";

// const combineReducer = combineReducers({
//   [roomSlice.name]: roomSlice.reducer,
//   [roomDetailSlice.name]: roomDetailSlice.reducer,
// });

// const reducer = (state, action) => {
//   if (action.type === HYDRATE) {
//     const nextState = {
//       ...state, // use previous state
//       ...action.payload, // apply delta from hydration
//     };
//     return nextState;
//   } else {
//     return combineReducer(state, action);
//   }
// };

const store = configureStore({
  reducer: {
    [roomSlice.name]: roomSlice.reducer,
    [roomDetailSlice.name]: roomDetailSlice.reducer,
    [authSlice.name]: authSlice.reducer,
    [loadUserSlice.name]: loadUserSlice.reducer,
    [forgetPasswordSlice.name]: forgetPasswordSlice.reducer,
    [resetPasswordSlice.name]: resetPasswordSlice.reducer,
    [checkBookingSlice.name]: checkBookingSlice.reducer,
    [BookedDatesSlice.name]: BookedDatesSlice.reducer,
    [AllBookingSlice.name]: AllBookingSlice.reducer,
    [BookingDetailSlice.name]: BookingDetailSlice.reducer,
    [AdminAllRoomsSlice.name]: AdminAllRoomsSlice.reducer,
    [AdminCreateRoomSlice.name]: AdminCreateRoomSlice.reducer,
    [DeleteImageSlice.name]: DeleteImageSlice.reducer,
    [AdminUpdateRoomSlice.name]: AdminUpdateRoomSlice.reducer,
    [BookitApi.reducerPath]: BookitApi.reducer,
  },
  middleware: (getDefaultMiddleWare) => {
    return getDefaultMiddleWare().concat(BookitApi.middleware);
  },

  devTools: true,
});

setupListeners(store.dispatch);

const makeStore = () => {
  return store;
};

export const wrapper = createWrapper(makeStore);
