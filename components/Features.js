import { Box, Typography } from "@mui/material";
import React from "react";
import AirlineSeatFlatIcon from "@mui/icons-material/AirlineSeatFlat";
import GroupIcon from "@mui/icons-material/Group";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";

const Features = ({ roomDetail }) => {
  return (
    <Box>
      <Typography gutterBottom variant="h4">
        Features:
      </Typography>
      <Box marginY={"1rem"}>
        {roomDetail?.room?.guestCapacity ? (
          <Typography
            gutterBottom
            sx={{ display: "flex", alignItems: "center" }}
          >
            <GroupIcon sx={{ marginRight: ".5rem" }} />{" "}
            {roomDetail?.room?.guestCapacity}{" "}
            {roomDetail?.room?.guestCapacity === 1 ? "Guest" : "Guests"}
          </Typography>
        ) : null}
        {roomDetail?.room?.numOfBeds ? (
          <Typography
            gutterBottom
            sx={{ display: "flex", alignItems: "center" }}
          >
            <AirlineSeatFlatIcon sx={{ marginRight: ".5rem" }} />{" "}
            {roomDetail?.room?.numOfBeds}{" "}
            {roomDetail?.room?.numOfBeds === 1 ? "Guest" : "Guests"}
          </Typography>
        ) : null}

        {roomDetail?.room?.breakFast ? (
          <Typography
            gutterBottom
            sx={{ display: "flex", alignItems: "center" }}
          >
            <DoneIcon sx={{ marginRight: ".5rem", color: "green" }} />
            BreakFast
          </Typography>
        ) : (
          <Typography
            gutterBottom
            sx={{ display: "flex", alignItems: "center" }}
          >
            <ClearIcon sx={{ marginRight: ".5rem", color: "red" }} />
            BreakFast
          </Typography>
        )}
        {roomDetail?.room?.internet ? (
          <Typography
            gutterBottom
            sx={{ display: "flex", alignItems: "center" }}
          >
            <DoneIcon sx={{ marginRight: ".5rem", color: "green" }} />
            Internet
          </Typography>
        ) : (
          <Typography
            gutterBottom
            sx={{ display: "flex", alignItems: "center" }}
          >
            <ClearIcon sx={{ marginRight: ".5rem", color: "red" }} />
            Internet
          </Typography>
        )}
        {roomDetail?.room?.petsAllowed ? (
          <Typography
            gutterBottom
            sx={{ display: "flex", alignItems: "center" }}
          >
            <DoneIcon sx={{ marginRight: ".5rem", color: "green" }} />
            Pets allowed
          </Typography>
        ) : (
          <Typography
            gutterBottom
            sx={{ display: "flex", alignItems: "center" }}
          >
            <ClearIcon sx={{ marginRight: ".5rem", color: "red" }} />
            petAllowed
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Features;
