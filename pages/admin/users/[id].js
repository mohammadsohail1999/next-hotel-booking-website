import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Layout from "../../../components/Layout";
import { Form, Formik } from "formik";
import AdminUpdateUserSchema from "../../../schema/AdminUpdateUserSchema";
import {
  useEditUserByIdMutation,
  useGetUserByIdQuery,
} from "../../../services/BookitApi";
import { toast } from "react-toastify";

const AdminEditUser = () => {
  // const {} =  useGetUserByIdQuery()

  const { query, isReady } = useRouter();

  const [EditUser, { isLoading, data: editUserData, isSuccess, isError }] =
    useEditUserByIdMutation();

  const { data, isFetching } = useGetUserByIdQuery(
    { id: query.id },
    {
      skip: isReady ? false : true,
    }
  );

  useEffect(() => {
    if (isSuccess) {
      toast.success("User Updated Successfully", {
        position: "top-right",
      });
    }
    if (isError) {
      toast.error("Error occured while updating user", {
        position: "top-right",
      });
    }
  }, [isSuccess, isError]);

  return (
    <Layout title={"Admin Update User"}>
      <Container
        sx={{
          marginTop: "5rem",
        }}
        maxWidth={"lg"}
      >
        <Box
          sx={(theme) => ({
            paddingX: "6rem",
            [theme.breakpoints.down("sm")]: {
              paddingX: 0,
            },
          })}
        >
          <Paper sx={{ paddingY: "1rem", paddingX: "1rem" }}>
            <Typography gutterBottom variant="h3" align="center">
              Update User
            </Typography>
            <Formik
              initialValues={{ name: "", email: "", role: "User" }}
              validationSchema={AdminUpdateUserSchema}
              onSubmit={(values) => {
                EditUser({ id: query.id, data: values });
              }}
            >
              {({ values, errors, touched, getFieldProps, setValues }) => {
                useEffect(() => {
                  if (data) {
                    setValues({
                      name: data?.user?.name,
                      email: data?.user?.email,
                      role: data?.user?.role,
                    });
                  }
                }, [data]);
                return (
                  <Form>
                    <Box sx={{ marginBottom: "1rem" }}>
                      <TextField
                        fullWidth
                        label="Name"
                        {...getFieldProps("name")}
                        id="name"
                        error={touched.name && Boolean(errors.name)}
                        helperText={errors.name}
                      />
                    </Box>
                    <Box sx={{ marginBottom: "1rem" }}>
                      <TextField
                        fullWidth
                        label="Email"
                        {...getFieldProps("email")}
                        id="email"
                        type={"email"}
                        error={touched.email && Boolean(errors.email)}
                        helperText={errors.email}
                      />
                    </Box>
                    <Box sx={{ marginBottom: "1.5rem", marginTop: ".6rem" }}>
                      <FormControl
                        fullWidth
                        error={touched.role && Boolean(errors.role)}
                      >
                        <InputLabel id="demo-simple-select-label">
                          Role
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Role"
                          {...getFieldProps("role")}
                        >
                          <MenuItem value={"User"}>User</MenuItem>
                          <MenuItem value={"Admin"}>Admin</MenuItem>
                        </Select>
                        {errors.role ? (
                          <FormHelperText>Error</FormHelperText>
                        ) : null}
                      </FormControl>
                    </Box>
                    <Button type="submit" variant="contained" fullWidth>
                      Update User
                    </Button>
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

export default AdminEditUser;
