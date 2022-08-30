import { useEffect, useState } from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
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
import resetPasswordSchema from "../../schema/resetPasswordSchema";
import { useDispatch, useSelector } from "react-redux";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  getResetPasswordState,
  reset,
  ResetPasswordAction,
} from "../../redux/features/resetPasswordSlice";

export default function ResetPassword() {
  const router = useRouter();

  const dispatch = useDispatch();

  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visiblePasswordConfirm, setVisiblePasswordConfirm] = useState(false);

  const { query } = useRouter();

  const handleSubmit = async (values) => {
    dispatch(
      ResetPasswordAction({
        password: values.password,
        passwordConfirm: values.passwordConfirm,
        token: query.token,
      })
    );
  };

  const { loading, success, error } = useSelector(getResetPasswordState);

  useEffect(() => {
    if (success) {
      toast.success(success.message, {
        position: "bottom-right",
      });
      router.push("/login");
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

  const changeVisible = (type) => (e) => {
    if (type === "password") {
      setVisiblePassword(!visiblePassword);
    } else {
      setVisiblePasswordConfirm(!visiblePasswordConfirm);
    }
  };

  return (
    <Layout title={"ResetPassword"}>
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
            <Typography variant="h3">Reset Password</Typography>
            <Formik
              initialValues={{ password: "", passwordConfirm: "" }}
              validationSchema={resetPasswordSchema}
              onSubmit={handleSubmit}
            >
              {({ values, getFieldProps, touched, errors }) => {
                return (
                  <Form style={{ marginTop: "1rem" }}>
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
                        type={visiblePassword ? "text" : "password"}
                        {...getFieldProps("password")}
                      />
                      {visiblePassword ? (
                        <VisibilityOffIcon
                          onClick={changeVisible("password")}
                          className="visIcon"
                        />
                      ) : (
                        <VisibilityIcon
                          onClick={changeVisible("password")}
                          className="visIcon"
                        />
                      )}
                    </div>
                    <div style={{ position: "relative", marginBottom: "1rem" }}>
                      <TextField
                        sx={{
                          "& input": {
                            paddingRight: "3rem",
                          },
                        }}
                        error={
                          touched.passwordConfirm &&
                          Boolean(errors.passwordConfirm)
                        }
                        helperText={errors.passwordConfirm}
                        label="Password Confirm"
                        fullWidth
                        placeholder="Confirm Password"
                        type={visiblePasswordConfirm ? "text" : "password"}
                        {...getFieldProps("passwordConfirm")}
                      />
                      {visiblePasswordConfirm ? (
                        <VisibilityOffIcon
                          onClick={changeVisible("passwordConfirm")}
                          className="visIcon"
                        />
                      ) : (
                        <VisibilityIcon
                          onClick={changeVisible("passwordConfirm")}
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
                      Reset Password
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
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
