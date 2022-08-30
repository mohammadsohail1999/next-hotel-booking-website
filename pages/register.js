import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import Layout from "../components/Layout";
import { Formik, Form } from "formik";
import { Container, Box, Paper, Typography, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { LoadingButton } from "@mui/lab";
import FileUpload from "../components/FileUpload";
import RegisterSchema from "../schema/registerSchema";
import { useDispatch, useSelector } from "react-redux";
import {
  getAuthState,
  registerUser,
  resetRegister,
} from "../redux/features/authSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { getBase64 } from "../utils/funcs";

const Register = () => {
  const [visible, setVisible] = useState(false);

  const changeVisible = () => {
    setVisible(!visible);
  };

  const router = useRouter();

  const dispatch = useDispatch();

  const { loading, error, success } = useSelector(getAuthState);

  useEffect(() => {
    if (success) {
      router.push("/login");
      toast.success(success.message, { position: "bottom-right" });
    }

    if (error) {
      toast.error(error.message, {
        position: "bottom-right",
      });
    }

    if (success || error) {
      dispatch(resetRegister());
    }
  }, [error, success]);

  const onSubmitHandle = async (values) => {
    let userData = { ...values };

    userData.image = await getBase64(userData.image);

    dispatch(registerUser(userData));

    // const imgBase64 = await getBase64(file);

    // const res = await axiosInstance.post("/api/auth/register", {
    //   image: imgBase64,
    // });
  };

  return (
    <Layout title={"register"}>
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
              overflow: "auto",
            }}
            elevation={3}
          >
            <Typography variant="h3">Register</Typography>
            <Formik
              initialValues={{ email: "", password: "", name: "", image: "" }}
              validationSchema={RegisterSchema}
              onSubmit={onSubmitHandle}
            >
              {({
                values,
                getFieldProps,
                touched,
                errors,
                handleBlur,
                setFieldValue,
                setFieldError,
                setFieldTouched,
              }) => {
                {
                  // console.log(touched);
                  // console.log(values, errors);
                }
                return (
                  <Form style={{ marginTop: "1rem" }}>
                    <TextField
                      fullWidth
                      placeholder="Enter Name"
                      type="text"
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name ? errors.name : ""}
                      label="Name"
                      sx={{ marginBottom: "1rem" }}
                      {...getFieldProps("name")}
                    />
                    <TextField
                      fullWidth
                      placeholder="Enter Email"
                      type="email"
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email ? errors.email : ""}
                      label="Email"
                      sx={{ marginBottom: "1rem" }}
                      {...getFieldProps("email")}
                    />
                    <div style={{ position: "relative", marginBottom: "1rem" }}>
                      <TextField
                        sx={{
                          "& input": {
                            paddingRight: "3rem",
                          },
                        }}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password ? errors.password : ""}
                        label="Password"
                        fullWidth
                        placeholder="Enter Password"
                        type={visible ? "text" : "password"}
                        {...getFieldProps("password")}
                      />
                      {visible ? (
                        <VisibilityOffIcon
                          onClick={changeVisible}
                          className="visIcon"
                        />
                      ) : (
                        <VisibilityIcon
                          onClick={changeVisible}
                          className="visIcon"
                        />
                      )}
                    </div>

                    <FileUpload
                      setFieldValue={setFieldValue}
                      handleBlur={handleBlur}
                      image={values.image}
                      error={errors.image}
                      touched={touched.image}
                      setFieldError={setFieldError}
                      setFieldTouched={setFieldTouched}
                    />

                    <LoadingButton
                      loading={loading}
                      variant="contained"
                      type="submit"
                      fullWidth
                    >
                      Register
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
};

export default Register;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
