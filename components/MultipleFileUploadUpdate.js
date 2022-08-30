import { Avatar, Badge, Button, Stack, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import React, { useEffect, useState } from "react";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { v4 } from "uuid";
import { useDispatch } from "react-redux";
import { AdminDeleteRoomImage } from "../redux/features/AdminImageDeleteSlice";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
// import CloseIcon from "@mui/icons-material/Close";
const StyledInput = styled("input")({
  display: "none",
});

const MultipleImageUploadUpdate = ({
  setTouched,
  images,
  setFieldValue,
  onBlur,
  errors,
  touched,
  uploadedImages,
}) => {
  const [imageDataArr, setImageDataArr] = useState([]);

  const dispatch = useDispatch();

  const { query } = useRouter();

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

  const delteUploadedImageHandler = (data) => (e) => {
    if (uploadedImages.length === 1) {
      toast.error("Minimum One image need to be there in uploaded Images", {
        position: "top-right",
      });
      return;
    }
    dispatch(AdminDeleteRoomImage(data));
  };

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
          disabled={uploadedImages.length === 4}
        />

        <Button
          color="primary"
          aria-label="upload picture"
          component="span"
          variant="contained"
          disabled={uploadedImages.length === 4}
        >
          <PhotoCamera sx={{ marginRight: ".5rem" }} />
          Upload Image
        </Button>
        <Typography
          sx={{ marginTop: "1rem", color: "rgba(255, 255, 255, 0.7)" }}
          variant="p"
          component={"p"}
        >
          *png, jpg or jpeg
        </Typography>
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

      <Box sx={{ marginTop: "1rem" }}>
        <Box sx={{ marginTop: "1rem" }}>
          <Typography variant="p">Uploaded Images</Typography>
          {uploadedImages ? (
            <Stack sx={{ marginTop: "1rem" }} direction={"row"} spacing={2}>
              {uploadedImages.map((el) => {
                return (
                  <Badge
                    style={{ cursor: "pointer" }}
                    badgeContent="X"
                    color="primary"
                    key={el.public_id}
                    onClick={delteUploadedImageHandler({
                      public_id: el.public_id,
                      roomId: query.id,
                    })}
                  >
                    <Avatar
                      variant="square"
                      sx={{ width: 65, height: 65 }}
                      src={el.url}
                      alt={"uploaded image"}
                    />
                  </Badge>
                );
              })}
            </Stack>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};

export default MultipleImageUploadUpdate;
