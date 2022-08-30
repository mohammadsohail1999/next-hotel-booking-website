import { useState } from "react";
import { signIn, getCsrfToken, getSession } from "next-auth/react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import LoginSchema from "../schema/loginschema";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";
import Link from "next/link";

export default function SignIn({ csrfToken }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const changeVisible = () => {
    setVisible(!visible);
  };
  const handleSubmit = async (values) => {
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });
    setLoading(false);
    if (result.error) {
      toast.error(result.error, {
        position: "bottom-right",
      });
    } else {
      router.push(router.query?.next || "/");
    }

    // if (result.ok) {
    // }
  };

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
            <Typography variant="h3">Login</Typography>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={handleSubmit}
            >
              {({ values, getFieldProps, touched, errors }) => {
                // {
                //   console.log(values, errors);
                // }
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
                    <div style={{ position: "relative", marginBottom: "1rem" }}>
                      <TextField
                        sx={{
                          "& input": {
                            paddingRight: "3rem",
                          },
                        }}
                        error={touched.password && Boolean(errors.password)}
                        helperText={errors.password}
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

                    <LoadingButton
                      loading={loading}
                      variant="contained"
                      type="submit"
                      fullWidth
                    >
                      Log In
                    </LoadingButton>
                  </Form>
                );
              }}
            </Formik>
            <Link href="/forgetPassword">
              <Typography sx={{ cursor: "pointer", marginTop: "1rem" }}>
                Forgot Password ?
              </Typography>
            </Link>
          </Paper>
        </Box>
      </Container>
    </Layout>
  );
}

// This is the recommended way for Next.js 9.3 or newer
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
    props: {},
  };
}
