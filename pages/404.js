import { Container, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect } from "react";
import Layout from "../components/Layout";

const NotFound = () => {
  return (
    <Layout title={"Not Found"}>
      <Container maxWidth="lg" sx={{ marginTop: "7rem" }}>
        <Typography align="center" variant="h3">
          Not Found(404).{" "}
          <Link href="/">
            <a style={{ color: "inherit", textDecoration: "none" }}>
              Go Back To Home.
            </a>
          </Link>
        </Typography>
      </Container>
    </Layout>
  );
};

export default NotFound;
