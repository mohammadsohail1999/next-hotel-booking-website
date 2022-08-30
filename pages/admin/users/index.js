import { Container, Typography } from "@mui/material";
import React from "react";
import Layout from "../../../components/Layout";
import AdminUserTable from "../../../components/AdminUserTable";

const AdminUser = () => {
  return (
    <Layout title="AdminUsers">
      <Container maxWidth={"lg"} sx={{ marginTop: "5rem" }}>
        <AdminUserTable />
      </Container>
    </Layout>
  );
};

export default AdminUser;
