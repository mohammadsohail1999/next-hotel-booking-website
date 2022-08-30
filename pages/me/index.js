import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import Layout from "../../components/Layout";
import { Container, Paper, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getLoadedUserState,
  loadUser,
  updateUser,
} from "../../redux/features/loadUserSlice";
import { Box } from "@mui/system";
import { Form, Formik } from "formik";
import RegisterSchema from "../../schema/registerSchema";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import FileUpload from "../../components/FileUpload";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { getBase64 } from "../../utils/funcs";
import UpdateProfileSchema from "../../schema/updateProfileSchema";

const Me = () => {
  const [visible, setVisible] = useState(false);

  const changeVisible = () => {
    setVisible(!visible);
  };

  const dispatch = useDispatch();

  const { user, isUpdated, loading } = useSelector(getLoadedUserState);

  useEffect(() => {
    if (isUpdated) {
      dispatch(loadUser());
      toast.success("Profile Updated Successfully", {
        position: "bottom-right",
      });
    }
  }, [isUpdated]);

  const submitHandler = async (values) => {
    let userData = { ...values };

    if (userData.image) {
      userData.image = await getBase64(userData.image);
    }

    dispatch(updateUser(userData));
  };

  return (
    <Layout title={"me"}>
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
            <Typography align="center" variant="h4">
              Update Profile
            </Typography>
            <Formik
              initialValues={{ email: "", password: "", name: "", image: "" }}
              validationSchema={UpdateProfileSchema}
              onSubmit={submitHandler}
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
                setValues,
              }) => {
                useEffect(() => {
                  if (user) {
                    setValues({
                      name: user.name,
                      email: user.email,
                      password: "",
                      image: "",
                    });
                  }
                }, [user]);

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
                      Update Profile
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

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: `/login?next=${ctx.req.url}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

export default Me;
