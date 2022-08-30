import React from "react";
import Layout from "../../../components/Layout";
import { Container, Typography } from "@mui/material";
import EnhancedTable from "../../../components/BookingTable";
import { getSession } from "next-auth/react";

const Bookings = () => {
  return (
    <Layout title="My Bookings">
      <Container maxWidth="lg" sx={{ marginTop: "5rem" }}>
        <Typography variant="h3">My Bookings</Typography>
        <EnhancedTable />
      </Container>
    </Layout>
  );
};

export default Bookings;

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
