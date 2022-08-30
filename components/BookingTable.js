import * as React from "react";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { IconButton, Skeleton, Stack } from "@mui/material";
import moment from "moment";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DownloadIcon from "@mui/icons-material/Download";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBookingsState,
  fetchAllBookings,
} from "../redux/features/AllBookingsSlice";
import Link from "next/link";

const HeadCells = [
  "Booking ID",
  "Check In",
  "Check Out",
  "Amount Paid",
  "Actions",
];

function EnhancedTableHead() {
  return (
    <TableHead>
      <TableRow>
        {HeadCells.map((el) => (
          <TableCell key={el}>{el}</TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function TableContent({ data }) {
  return data.map((el, i) => {
    return (
      <TableRow key={el._id}>
        <TableCell>{el._id}</TableCell>
        <TableCell>{moment(el.checkInDate).format("MM/DD/YYYY")}</TableCell>
        <TableCell>{moment(el.checkOutDate).format("MM/DD/YYYY")}</TableCell>
        <TableCell>{el.amountPaid}</TableCell>
        <TableCell>
          <Stack direction={"row"} spacing={2}>
            <Link href={`/me/bookings/${el._id}`} passHref>
              <IconButton>
                <RemoveRedEyeIcon />
              </IconButton>
            </Link>
          </Stack>
        </TableCell>
      </TableRow>
    );
  });
}

function TableSkeleton() {
  return Array.apply(null, Array(3)).map((el, i) => {
    return (
      <TableRow key={i}>
        <TableCell>
          <Skeleton width="100%" height="4rem" />
        </TableCell>
        <TableCell>
          <Skeleton width="100%" height="4rem" />
        </TableCell>
        <TableCell>
          <Skeleton width="100%" height="4rem" />
        </TableCell>
        <TableCell>
          <Skeleton width="100%" height="4rem" />
        </TableCell>
        <TableCell>
          <Skeleton width="100%" height="4rem" />
        </TableCell>
      </TableRow>
    );
  });
}

export default function EnhancedTable() {
  const dispatch = useDispatch();

  const { success, error, loading } = useSelector(getAllBookingsState);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  React.useEffect(() => {
    dispatch(
      fetchAllBookings({ page: Number(page) + 1, limit: Number(rowsPerPage) })
    );
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  if (success) {
    if (!success.bookings.length) {
      return (
        <Box sx={{ width: "100%" }}>
          <Typography variant="h2" align="center">
            No Bookings Present.
          </Typography>
        </Box>
      );
    }
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ marginTop: "3rem", width: "100%", mb: 2 }}>
       
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <EnhancedTableHead />
            <TableBody>
              {success ? (
                <>
                  <TableContent data={success.bookings} />
                </>
              ) : (
                <>
                  <TableSkeleton />
                </>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={success?.totalBookings || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Paper>
    </Box>
  );
}
