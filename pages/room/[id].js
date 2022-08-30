import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
  Button,
  Alert,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import Link from "next/link";

import {
  fetchRoomDetails,
  getRoomDetailState,
} from "../../redux/features/roomDetailsSlice";
import { wrapper } from "../../redux/store";
import Image from "next/image";
import DateRangePicker from "../../components/DateRangePicker";
import { getLoadedUserState } from "../../redux/features/loadUserSlice";
import axiosInstance from "../../utils/axiosInstance";
import { useRouter } from "next/router";
import { Daysinbetween } from "../../utils/funcs";
import {
  checkBookingAvaibility,
  getBookingCheckState,
} from "../../redux/features/CheckBookingSlice";
import {
  fetchBookedDates,
  getBookedDatesState,
} from "../../redux/features/BookedDatesSlice";
import moment from "moment";
import getStripe from "../../utils/get-stripe";
import Features from "../../components/Features";

getStripe();

const RoomDetail = () => {
  const dispatch = useDispatch();

  const { roomDetail, error } = useSelector(getRoomDetailState);

  const { isAuthenticated, loading } = useSelector(getLoadedUserState);
  const {
    success,
    error: bookingcheckError,
    loading: bookingCheckLoading,
  } = useSelector(getBookingCheckState);

  const { error: bookedDatesError, dates } = useSelector(getBookedDatesState);

  const { user } = useSelector(getLoadedUserState);

  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    if (error) {
      toast.error(error.message, {
        position: "bottom-right",
      });
    }
  }, [error]);

  useEffect(() => {
    if (dates) {
      setBookedDates(
        dates.bookedDates.map((el) => moment(new Date(el)).format("YYYY-MM-DD"))
      );
  }
  }, [dates]);

  const { query } = useRouter();

  const [checkInandOut, setCheckInAndOut] = useState([null, null]);

  useEffect(() => {
    dispatch(fetchBookedDates(query.id));
  }, []);

  useEffect(() => {
    if (!checkInandOut.includes(null)) {
      dispatch(checkBookingAvaibility({ checkInandOut, roomId: query.id }));
      Daysinbetween(checkInandOut[0], checkInandOut[1]);
    }
  }, [checkInandOut]);

  return (
    <Layout title={roomDetail?.room?.name || "Not Found"}>
      <Container sx={{ marginTop: "6rem" }} maxWidth="lg">
        {roomDetail ? (
          <>
            <Typography variant="h4">{roomDetail?.room?.name}</Typography>
            <Typography varaint="p">{roomDetail?.room?.address}</Typography>

            <Box marginTop={"1rem"}>
              <AliceCarousel
                items={roomDetail?.room?.images?.map((el) => (
                  <img
                    src={el.url}
                    style={{ width: "100vw", height: "60vh" }}
                  />
                ))}
                autoPlay
                infinite
                autoPlayInterval={3000}
                disableDotsControls
              />
            </Box>
            <Grid mt={"2rem"} container spacing={2}>
              <Grid item md={8} xs={12}>
                <Box sx={{ marginY: "2rem" }}>
                  <Typography gutterBottom variant="h4">
                    Description
                  </Typography>
                  <Typography variant="p">
                    {roomDetail?.room?.description}
                  </Typography>
                </Box>

                <Features roomDetail={roomDetail} />
              </Grid>
              <Grid item md={4} xs={12}>
                <Paper sx={{ padding: "1rem .5rem" }} elevation={2}>
                  <Typography gutterBottom variant="h4">
                    <b>$ {roomDetail?.room?.price}</b> / night
                  </Typography>
                  <Divider />
                  {isAuthenticated ? (
                    <Box sx={{ marginTop: "2rem" }}>
                      <Typography variant="h6">
                        Please Pick Checkout and CheckIn Date.
                      </Typography>
                      <Box sx={{ marginTop: "2rem" }}>
                        <DateRangePicker
                          setValue={setCheckInAndOut}
                          value={checkInandOut}
                          BookedDates={bookedDates}
                        />
                      </Box>
                      <Box marginTop={"1rem"} marginX="1rem">
                        {success && success.isAvailaible ? (
                          <Alert sx={{ marginY: "1rem" }} severity="success">
                            Room is Availaible
                          </Alert>
                        ) : null}
                        {success && !success.isAvailaible ? (
                          <Alert sx={{ marginY: "1rem" }} severity="error">
                            Room is Not Availaible
                          </Alert>
                        ) : null}

                        <Button
                          disabled={
                            checkInandOut.includes(null) &&
                            !success &&
                            !success?.isAvailaible
                          }
                          fullWidth
                          variant="contained"
                          onClick={async () => {
                            const { data } = await axiosInstance.post(
                              "/api/checkout_sessions",
                              {
                                price:
                                  roomDetail?.room?.price *
                                  Number(
                                    Daysinbetween(
                                      checkInandOut[0],
                                      checkInandOut[1]
                                    )
                                  ),
                                email: user?.email,
                                hotelName: roomDetail?.room?.name,
                                image: roomDetail?.room?.images[0]?.url,
                                roomId: query.id,
                                checkInDate: checkInandOut[0],
                                checkOutDate: checkInandOut[1],
                                daysOfStay: Daysinbetween(
                                  checkInandOut[0],
                                  checkInandOut[1]
                                ),
                              }
                            );

                            if (data) {
                              window.open(data.session.url);
                            }
                          }}
                        >
                          Pay
                        </Button>
                      </Box>
                    </Box>
                  ) : !loading ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginY: "2rem",
                      }}
                    >
                      <Link href="/login" passHref>
                        <Button variant="contained">
                          Please Login to Make Booking
                        </Button>
                      </Link>
                    </Box>
                  ) : null}
                </Paper>
              </Grid>
            </Grid>
          </>
        ) : (
          <Typography variant="h3" align="center">
            Not Found
          </Typography>
        )}
      </Container>
    </Layout>
  );
};

export default RoomDetail;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    await store.dispatch(fetchRoomDetails(ctx.query.id));
    return {
      props: {},
    };
  }
);
