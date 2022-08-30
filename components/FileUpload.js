import { IconButton, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

const FileUpload = ({
  setFieldValue,
  image,
  handleBlur,
  error,
  touched,
  setFieldError,
  setFieldTouched,
}) => {
  const changeHandler = (e) => {
    setFieldValue("image", e.target.files[0]);
  };

  const [imageURL, setImageURL] = useState("");

  useEffect(() => {
    if (image !== "") {
      let reader = new FileReader();
      reader.onload = function (e) {
        setImageURL(e.target.result);
      };
      reader.readAsDataURL(image);
    }
  }, [image]);

  if (imageURL !== "") {
    return (
      <div style={{ display: "flex", alignItems: "center", margin: "1rem 0" }}>
        <img
          src={imageURL}
          style={{ width: 40, height: 40, borderRadius: "50%" }}
        />
        <IconButton
          onClick={() => {
            setFieldValue("image", "");
            setImageURL("");
            setFieldError("image", "");
            setFieldTouched("image", false);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    );
  }
  return (
    <TextField
      sx={{
        marginBottom: "1rem",
      }}
      type={"file"}
      onChange={changeHandler}
      onBlur={handleBlur}
      name={"image"}
      fullWidth
      error={touched && Boolean(error)}
      helperText={touched ? error : ""}
    />
  );
};

export default FileUpload;
