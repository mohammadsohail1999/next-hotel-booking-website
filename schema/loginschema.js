import * as Yup from "yup";

const LoginSchema = Yup.object({
  email: Yup.string().email("Invalid Email").required("email is required"),
  password: Yup.string()
    .required("password us Required")
    .min(6, "min 6 characters required"),
});

export default LoginSchema;
