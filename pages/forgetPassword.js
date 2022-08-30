import { useEffect, useState } from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { getSession } from "next-auth/react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import ForgotPasswordSchema from "../schema/forgotPasswordSchema";
import { useDispatch, useSelector } from "react-redux";
import {
  getforgetPasswordState,
  getForgotPasswordToken,
  reset,
} from "../redux/features/forgetPasswordSlice";

export default function ForgotPassword() {
  const router = useRouter();

  const { loading, success, error } = useSelector(getforgetPasswordState);
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    dispatch(getForgotPasswordToken(values.email));
  };

  console.log(error, success);

  useEffect(() => {
    if (success) {
      toast.success(success.message, {
        position: "bottom-right",
      });
    }
    if (error) {
      toast.error(error.message, {
        position: "bottom-right",
      });
    }

    if (success || error) {
      dispatch(reset());
    }
  }, [success, error]);

  return (
    <Layout title={"Login"}>
      <Container sx={{ marginTop: "5rem" }} maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Paper
            sx={{
              padding: "2rem",
              width: "70%",
              marginTop: "3rem",
              height: "60vh",
            }}
            elevation={3}
          >
            <Typography variant="h3">Forgot Password</Typography>
            <Formik
              initialValues={{ email: "" }}
              validationSchema={ForgotPasswordSchema}
              onSubmit={handleSubmit}
            >
              {({ values, getFieldProps, touched, errors }) => {
                return (
                  <Form style={{ marginTop: "1rem" }}>
                    <TextField
                      fullWidth
                      placeholder="Enter Email"
                      type="email"
                      error={touched.email && Boolean(errors.email)}
                      helperText={errors.email}
                      label="Email"
                      sx={{ marginBottom: "1rem" }}
                      {...getFieldProps("email")}
                    />

                    <LoadingButton
                      loading={loading}
                      variant="contained"
                      type="submit"
                      fullWidth
                    >
                      Forgot Password
                    </LoadingButton>
                  </Form>
                );
              }}
            </Formik>
          </Paper>
        </Box>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (session) {
    return {
      redirect: {
        distination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
