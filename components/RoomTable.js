import * as React from "react";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Button, IconButton, Skeleton, Stack, TextField } from "@mui/material";
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

const HeadCells = ["Room ID", "Name", "Price/Night", "Category", "Actions"];

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
        <TableCell>{el.price} Rs/night</TableCell>
        <TableCell>{el.category}</TableCell>
        <TableCell>
          <Stack direction={"row"} spacing={2}>
            <Link href={`/admin/rooms/${el._id}`} passHref>
              <IconButton>
                <EditIcon />
              </IconButton>
            </Link>
            <IconButton onClick={deleteRoomHandler(el._id)}>
              <DeleteIcon />
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
  const dispatch = useDispatch();

  const { success, error, loading, isDeleted } = useSelector(
    getAdminAllRoomsState
  );

  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [initialPage, setinitialPage] = React.useState(true);

  const term = useDebounce(search, 2000);

  React.useEffect(() => {
    if (page !== 0) {
      setPage(0);
      setinitialPage(true);
    }
    dispatch(fetchAllAdminRooms({ search: term, type: "search" }));
  }, [term]);

  React.useEffect(() => {
    if (initialPage) {
      setinitialPage(false);
      return;
    }

    if (!term) {
      dispatch(
        fetchAllAdminRooms({
          page: Number(page) + 1,
          limit: rowsPerPage,
          type: "pageChange",
        })
      );
      return;
    }
    dispatch(
      fetchAllAdminRooms({
        page: Number(page) + 1,
        limit: rowsPerPage,
        type: "pageChange",
      })
    );
  }, [page, rowsPerPage]);

  React.useEffect(() => {
    if (error) {
      toast.error("An Error Occured", { position: "top-right" });
    }

    if (isDeleted) {
      toast.success("Room is Deleted Successfully", { position: "top-right" });
      dispatch(
        fetchAllAdminRooms({
          page: Number(page) + 1,
          limit: rowsPerPage,
          search: term,
          type: "",
        })
      );
    }
  }, [error, isDeleted]);

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

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ marginY: "2rem" }}>
        <TextField
          onChange={handleSearchChange}
          value={search}
          variant="standard"
          fullWidth
          label="Search Room"
          placeholder="Search Room"
        />
      </Box>
      <Paper sx={{ marginTop: "3rem", width: "100%", mb: 2 }}>
        {success && !success?.totalRooms ? (
          <Box sx={{ padding: "2rem 1rem" }}>
            <Typography variant="h4">No Results</Typography>
          </Box>
        ) : (
          <Box sx={{ padding: "2rem 1rem" }}>
            <Typography variant="h4">
              Total Results {success ? `(${success?.totalRooms})` : "(0)"}
            </Typography>
          </Box>
        )}

        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <EnhancedTableHead />
            <TableBody>
              {success ? (
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
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={success?.totalRooms || 0}
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
