import * as Yup from "yup";

export default Yup.object({
  email: Yup.string().email("Invalid email").required("email is required"),
  name: Yup.string()
    .min(3, "minimum 3 character is required")
    .max(15, "max 15 characters is required").required("name is required"),
  role: Yup.string()
    .oneOf(["User", "Admin"])
    .required("Please select the role"),
});
