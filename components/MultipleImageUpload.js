import { Avatar, Badge, Button, Stack, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import React, { useEffect, useState } from "react";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { v4 } from "uuid";
// import CloseIcon from "@mui/icons-material/Close";

const StyledInput = styled("input")({
  display: "none",
});

const MultipleImageUpload = ({
  setTouched,
  images,
  setFieldValue,
  onBlur,
  errors,
  touched,
}) => {
  const [imageDataArr, setImageDataArr] = useState([]);

  useEffect(() => {
    if (images.length === 0) setImageDataArr([]);
    images.forEach((el) => {
      readURL(el);
    });
  }, [images]);

  function readURL(file) {
    let reader = new FileReader();
    reader.onload = function (e) {
      setImageDataArr((prevState) => [
        ...prevState,
        {
          id: v4(),
          name: file.name,
          url: e.target.result,
        },
      ]);
    };
    reader.readAsDataURL(file);
  }

  return (
    <Box sx={{ marginY: "2rem" }}>
      <label htmlFor="images">
        <StyledInput
          accept="image/*"
          id="images"
          type="file"
          name="images"
          multiple
          onChange={(e) => {
            const images = Object.values(e.target.files);
            setFieldValue("images", images);
          }}
        />
        <Button
          color="primary"
          aria-label="upload picture"
          component="span"
          variant="contained"
        >
          <PhotoCamera sx={{ marginRight: ".5rem" }} />
          Upload Image
        </Button>
      </label>
      {touched && errors ? (
        <Box sx={{ marginTop: "1rem" }}>
          <Typography variant="p" sx={{ marginTop: "1rem", color: "red" }}>
            *{errors}
          </Typography>
        </Box>
      ) : null}

      <Box sx={{ marginTop: "1rem" }}>
        {imageDataArr.length ? (
          <>
            <Stack direction="row" spacing={2}>
              {imageDataArr.map((el) => {
                return (
                  <img
                    key={el.id}
                    alt={el.name}
                    style={{ width: "80px", height: "70px" }}
                    src={el.url}
                  />
                );
              })}
            </Stack>
            <Button
              onClick={() => {
                setFieldValue("images", []);
              }}
            >
              Clear All
            </Button>
          </>
        ) : (
          "No Images"
        )}
      </Box>
    </Box>
  );
};

export default MultipleImageUpload;
