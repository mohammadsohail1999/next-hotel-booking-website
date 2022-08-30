import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const NotInternet = () => {
  const [status, setStatus] = useState("online");

  useEffect(() => {
    window.ononline = () => {
      setStatus("online");
    };
    window.onoffline = () => {
      setStatus("offline");
    };
  }, []);

  if (status === "offline") {
    return (
      <Box sx={{ background: "red", paddingY: ".5rem" }}>
        <Typography
          variant="p"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ErrorOutlineIcon fontSize="small" sx={{ marginRight: ".4rem" }} />{" "}
          Connection Lost!
        </Typography>
      </Box>
    );
  }

  return <></>;
};

export default NotInternet;
