import * as Yup from "yup";

const ForgotPasswordSchema = Yup.object({
  email: Yup.string().email("Invalid Email").required("email is required"),
});

export default ForgotPasswordSchema;
