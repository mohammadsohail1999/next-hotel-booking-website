import * as Yup from "yup";

const resetPasswordSchema = Yup.object({
  password: Yup.string().required("Password is required"),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Password Confirm is required"),
});

export default resetPasswordSchema;
