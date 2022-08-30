import React from "react";
import DateFnsAdapter from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { MobileDateRangePicker } from "@mui/lab";
import { Box, TextField } from "@mui/material";
import moment from "moment";

const DateRangePicker = ({ value, setValue, BookedDates }) => {
  const getDisableDate = (date) => {
    let formatedDate = moment(new Date(date)).format("YYYY-MM-DD");

    return BookedDates.includes(formatedDate);
  };

  return (
    <LocalizationProvider dateAdapter={DateFnsAdapter}>
      <MobileDateRangePicker
        disablePast
        startText="Check In"
        endText="Check Out"
        value={value}
        shouldDisableDate={getDisableDate}
        onChange={(newValue) => {
          setValue([
            newValue[0]?.toISOString() || null,
            newValue[1]?.toISOString() || null,
          ]);
        }}
        renderInput={(startProps, endProps) => (
          <React.Fragment>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
              }}
            >
              <TextField
                fullWidth
                sx={{ marginBottom: "1rem" }}
                {...startProps}
              />
              <TextField fullWidth {...endProps} />
            </Box>
          </React.Fragment>
        )}
      />
    </LocalizationProvider>
  );
};

export default DateRangePicker;
