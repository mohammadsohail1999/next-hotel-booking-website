import { Container, Typography } from "@mui/material";
import React from "react";
import Layout from "../../../components/Layout";
import AdminBookingTable from "../../../components/AdminBookingTable";

const AdminBookings = () => {
  return (
    <Layout title="Admin Bookings">
      <Container sx={{ marginTop: "5rem" }} maxWidth="lg">
        <Typography variant="h3">All Bookings</Typography>
        <AdminBookingTable />
      </Container>
    </Layout>
  );
};

export default AdminBookings;
