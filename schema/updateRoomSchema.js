import * as Yup from "yup";

const FILE_SIZE = 1024 * 1024;
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

let files = [];

const UpdatedRoomSchema = function (uploadedimagesLength) {
  return Yup.object({
    name: Yup.string().required("name is required"),
    price: Yup.number().min(1, "invalid price").required("price is required"),
    address: Yup.string().required("address is required"),
    description: Yup.string().required("description is required"),

    numOfBeds: Yup.number()
      .required("number of beds required")
      .oneOf([1, 2, 3, 4], "Invalid Value Entered"),
    guestsCapacity: Yup.number()
      .required("number of Guests required")
      .oneOf([1, 2, 3, 4, 5], "Invalid value entered"),
    category: Yup.string()
      .oneOf(["King", "Twins", "Single"])
      .required("Category is Required"),
    images: Yup.array()
      .ensure()
      .min(0)
      .max(
        4 - uploadedimagesLength,
        `Maximum ${4 - uploadedimagesLength} images are required`
      )
      .test(
        "is-correct-file",
        "All Images should be in jpeg or png format",
        (value) => {
          if (!value.length) {
            files = [];
            return true;
          }

          let validate = true;

          files = [...files, ...value];

          files.forEach((el) => {
            if (!SUPPORTED_FORMATS.includes(el.type)) {
              validate = false;
              return;
            }
          });

          return validate;
        }
      )
      .test("is-big-file", "All Images should be under size 1mb", (value) => {
        if (!value.length) {
          files = [];
          return true;
        }
        let validate = true;
        files = [...files, ...value];
        files.forEach((el) => {
          if (el.size > FILE_SIZE) {
            validate = false;
            return;
          }
        });

        return validate;
      }),
  });
};

export default UpdatedRoomSchema;
