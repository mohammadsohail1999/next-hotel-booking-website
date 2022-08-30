import * as React from "react";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import {
  Button,
  IconButton,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TextField,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  deleteRoomById,
  fetchAllAdminRooms,
  getAdminAllRoomsState,
  searchTerm,
} from "../redux/features/AdminAllRoomsSlice";
import useDebounce from "../hooks/useDebounce";
import { useGetAllUsersQuery } from "../services/BookitApi";

const HeadCells = ["USER ID", "Name", "Email", "Role", "Actions"];

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

function TableContent({ data, deleteRoomHandler }) {
  return data.map((el, i) => {
    return (
      <TableRow key={el._id}>
        <TableCell>{el._id}</TableCell>
        <TableCell>{el.name}</TableCell>
        <TableCell>{el.email} Rs/night</TableCell>
        <TableCell>{el.role}</TableCell>
        <TableCell>
          <Stack direction={"row"} spacing={2}>
            <Link href={`/admin/users/${el._id}`} passHref>
              <IconButton>
                <EditIcon />
              </IconButton>
            </Link>
            {/* <IconButton onClick={deleteRoomHandler(el._id)}>
              <DeleteIcon />
            </IconButton> */}
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
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sort, setSort] = React.useState("newest");

  const term = useDebounce(search, 2000);

  const { isLoading, isFetching, data } = useGetAllUsersQuery({
    search: term,
    page: Number(page) + 1,
    limit: rowsPerPage,
    sort: sort,
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const deleteRoomHandler = (id) => (e) => {
    dispatch(deleteRoomById({ id }));
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          marginY: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextField
          onChange={handleSearchChange}
          value={search}
          variant="standard"
          fullWidth
          label="Search User"
          placeholder="Search User"
        />
        <Select
          sx={{ marginLeft: "2rem" }}
          id="demo-simple-select"
          value={sort}
          onChange={handleSortChange}
        >
          <MenuItem value={"newest"}>Newest</MenuItem>
          <MenuItem value={"oldest"}>Oldest</MenuItem>
        </Select>
      </Box>
      <Paper sx={{ marginTop: "3rem", width: "100%", mb: 2 }}>
        {/* {success && !success?.totalRooms ? (
          <Box sx={{ padding: "2rem 1rem" }}>
            <Typography variant="h4">No Results</Typography>
          </Box>
        ) : (
          <Box sx={{ padding: "2rem 1rem" }}>
            <Typography variant="h4">
              Total Results {success ? `(${success?.totalRooms})` : "(0)"}
            </Typography>
          </Box>
        )} */}

        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <EnhancedTableHead />
            <TableBody>
              {isFetching ? (
                <TableSkeleton />
              ) : (
                <TableContent data={data?.users} />
              )}
              {/* {success ? (
                <>
                  <TableContent
                    deleteRoomHandler={deleteRoomHandler}
                    data={success.rooms}
                  />
                </>
              ) : (
                <>
                  <TableSkeleton />
                </>
              )} */}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data?.total || 0}
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
