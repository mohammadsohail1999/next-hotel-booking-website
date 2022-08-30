import { Container, ThemeProvider, Typography } from "@mui/material";
import React from "react";
import Layout from "../components/Layout";
import theme from "../theme/theme";

const about = () => {
  return (
    <>
      {console.log(theme)}
      <Layout title="About">
        <Container sx={{ marginTop: "6rem" }} maxWidth="lg">
          <Typography variant="h4" align="center">
            {" "}
            About Us
          </Typography>
        </Container>
      </Layout>
    </>
  );
};

export default about;
