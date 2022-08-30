import * as Yup from "yup";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];
const FILE_SIZE = 1 * 1024 * 1024;

const UpdateProfileSchema = Yup.object({
  email: Yup.string().email("Invalid Email").required("email is required"),
  password: Yup.string().min(6, "min 6 characters required"),
  name: Yup.string().required("name is required"),
  image: Yup.mixed()
    .test(
      "fileSize",
      "File too large",
      (value) => value && value.size <= FILE_SIZE
    )
    .test(
      "fileFormat",
      "Unsupported Format",
      (value) => value && SUPPORTED_FORMATS.includes(value.type)
    ),
});

export default UpdateProfileSchema;
