import React, { useEffect } from "react";
import { getRoomState } from "../redux/features/roomSlice";
import { useSelector } from "react-redux";
import { Typography, Box, Container, Grid, Pagination } from "@mui/material";
import RoomCard from "./RoomCard";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useTheme } from "@mui/styles";

const Home = () => {
  const { rooms, error, roomCount } = useSelector(getRoomState);

  const theme = useTheme();

  const router = useRouter();

  const { page } = router.query;

  const pages =
    (roomCount / 4) % 1 === 0
      ? Math.floor(roomCount / 4)
      : Math.floor(roomCount / 4) + 1;

  useEffect(() => {
    toast.error(error?.message, { position: "bottom-right" });
  }, [error]);

  return (
    <Container maxWidth="lg" sx={{ paddingTop: "5rem" }}>
      <Typography variant="h3">All Rooms</Typography>
      {rooms.length ? (
        <>
          <Grid sx={{ marginTop: "2rem" }} container spacing={2}>
            {/* {rooms} */}
            {rooms.map((el) => {
              return (
                <Grid key={el._id} item lg={3} md={4} sm={6} xs={12}>
                  <RoomCard room={el} />
                </Grid>
              );
            })}
          </Grid>
          <Box
            sx={{ marginTop: "1rem" }}
            display="flex"
            justifyContent={"center"}
            alignItems="center"
          >
            <Pagination
              defaultPage={page ? Number(page) : 1}
              count={pages}
              onChange={(e) => {
                router.push(`?page=${e.target.textContent}`);
              }}
              color="primary"
            />
          </Box>
        </>
      ) : null}
    </Container>
  );
};

export default Home;
