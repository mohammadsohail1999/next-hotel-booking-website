import * as React from "react";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Stack,
} from "@mui/material";
import moment from "moment";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Link from "next/link";
import {
  useDeleteBookingMutation,
  useGetAllBookingsQuery,
} from "../services/BookitApi";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";

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
  const [deleteBooking, { data: mutationData, error, isSuccess, isLoading }] =
    useDeleteBookingMutation();

  React.useEffect(() => {
    if (isSuccess) {
      toast.success("Booking is Deleted Successfully", {
        position: "top-right",
      });
    }
  }, [isSuccess]);

  return data.map((el, i) => {
    return (
      <TableRow key={el._id}>
        <TableCell>{el._id}</TableCell>
        <TableCell>{moment(el.checkInDate).format("MM/DD/YYYY")}</TableCell>
        <TableCell>{moment(el.checkOutDate).format("MM/DD/YYYY")}</TableCell>
        <TableCell>{el.amountPaid}</TableCell>
        <TableCell>
          <Stack direction={"row"} spacing={1}>
            <Link href={`/me/bookings/${el._id}`} passHref>
              <IconButton>
                <RemoveRedEyeIcon />
              </IconButton>
            </Link>
            <IconButton
              onClick={() => {
                deleteBooking({ id: el._id });
              }}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton>
              <EditIcon />
            </IconButton>
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
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sort, setSort] = React.useState("newest");

  const { data, isFetching } = useGetAllBookingsQuery(
    {
      page: Number(page) + 1,
      limit: rowsPerPage,
      sort: sort,
    },
    {}
  );

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(0);
    setRowsPerPage(5);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  if (!isFetching && data) {
    if (!data?.Bookings?.length) {
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
        <Box sx={{ paddingY: "1rem", paddingX: "1rem" }}>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Sort</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={sort}
              label="Sort"
              onChange={handleSortChange}
            >
              <MenuItem value={"newest"}>Newest</MenuItem>
              <MenuItem value={"oldest"}>Oldest</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <EnhancedTableHead />
            <TableBody>
              {!isFetching ? (
                <>
                  <TableContent data={data?.Bookings} />
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
            count={isFetching ? 0 : data?.total}
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
