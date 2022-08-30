import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BookitApi = createApi({
  reducerPath: "BookitApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api" }),
  keepUnusedDataFor: 30,
  refetchOnMountOrArgChange: 30,
  tagTypes: ["Bookings", "Users"],
  endpoints: (builder) => {
    return {
      getAllBookings: builder.query({
        query: (queryData) => {
          const { page = 1, limit = 5, sort = "newest" } = queryData;
          return `/admin/booking?page=${page}&limit=${limit}&sort=${sort}`;
        },
        providesTags: ["Bookings"],
        // providesTags: (result, error, arg) =>
        // result
        //   ? [
        //       ...result.map(({ _id }) => {
        //         return { type: "Bookings", id: _id };
        //       }),
        //       "Bookings",
        //     ]
        //   : ["Bookings"],
      }),
      getAllUsers: builder.query({
        query: (userData) => {
          const {
            page = 1,
            limit = 5,
            sort = "newest",
            search = "",
          } = userData;
          return `/admin/users?page=${page}&limit=${limit}&sort=${sort}&search=${search}`;
        },
        providesTags: ["Users"],
      }),
      getUserById: builder.query({
        query: ({ id }) => {
          return `/admin/users/${id}`;
        },
        providesTags: (result, error, arg) => {
          return arg.id ? [{ type: "Users", id: arg.id }, "Users"] : ["Users"];
        },
      }),
      editUserById: builder.mutation({
        query: ({ id, data }) => ({
          url: `/admin/users/${id}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: (result, error, arg) => [
          { type: "Users", id: arg.id },
        ],
      }),
      deleteBooking: builder.mutation({
        query: ({ id }) => ({
          url: `/admin/booking?id=${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Bookings"],
      }),
    };
  },
});

export const {
  useGetAllBookingsQuery,
  useDeleteBookingMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useEditUserByIdMutation,
} = BookitApi;

export default BookitApi;
