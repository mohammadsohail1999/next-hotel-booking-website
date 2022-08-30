import {
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { toast } from "react-toastify";

import { LoadingButton } from "@mui/lab";
import React, { useEffect } from "react";
import Layout from "../../../components/Layout";
import { Formik, Form } from "formik";
import RoomSchema from "../../../schema/roomSchema";
import { useDispatch, useSelector } from "react-redux";
import {
  createRoomThunk,
  getAdminCreateRoomState,
} from "../../../redux/features/AdminCreateRoomSlice";
import { useRouter } from "next/router";
import {
  fetchRoomDetails,
  getRoomDetailState,
} from "../../../redux/features/roomDetailsSlice";
import MultipleImageUploadUpdate from "../../../components/MultipleFileUploadUpdate";
import {
  getDeleteImageState,
  reset,
} from "../../../redux/features/AdminImageDeleteSlice";
import UpdatedRoomSchema from "../../../schema/updateRoomSchema";
import {
  AdminUpdateReset,
  getAdminUpdateState,
  updateAdminRoomThunk,
} from "../../../redux/features/AdminUpdateRoomSlice";
import { getSession } from "next-auth/react";

const guestCapacity = [1, 2, 3, 4, 5];
const numofBeds = [1, 2, 3, 4, 5];
const category = ["King", "Twins", "Single"];

const UpdateRoom = () => {
  const dispatch = useDispatch();
  const { query } = useRouter();

  const { roomDetail, error } = useSelector(getRoomDetailState);

  const {
    success,
    loading,
    error: deleteImageError,
  } = useSelector(getDeleteImageState);

  const {
    success: UpdateSuccess,
    loading: UpdateLoading,
    error: UpdateError,
  } = useSelector(getAdminUpdateState);

  useEffect(() => {
    if (UpdateSuccess) {
      toast.success("Room is updated successfully", {
        position: "top-right",
      });
      dispatch(fetchRoomDetails(query.id));
      dispatch(AdminUpdateReset());
    }

    if (UpdateError) {
      toast.error("An Error Occured while updating room", {
        position: "top-right",
      });
      dispatch(AdminUpdateReset());
    }
  }, [UpdateSuccess]);

  useEffect(() => {
    if (query?.id) {
      dispatch(fetchRoomDetails(query.id));
    }
  }, [query]);

  useEffect(() => {
    if (success) {
      dispatch(fetchRoomDetails(query.id));
      dispatch(reset());
      toast.success("Uploaded Image Deleted SuccessFully", {
        position: "top-right",
      });
    }
    if (deleteImageError) {
      toast.error("An Error occured While deleting uploaded image", {
        position: "top-right",
      });
      dispatch(reset());
    }
  }, [success, deleteImageError]);

  return (
    <Layout title="Create Room">
      <Container sx={{ marginTop: "5rem" }} maxWidth="lg">
        <Paper sx={{ padding: "1rem 2rem" }} elevation={2}>
          <Typography variant="h3" gutterBottom>
            Update Room
          </Typography>
          <Formik
            initialValues={{
              name: "",
              price: 2000,
              description: "",
              address: "",
              guestsCapacity: 1,
              numOfBeds: 1,
              internet: false,
              breakFast: false,
              airConditioned: false,
              petsAllowed: false,
              images: null,
              category: "King",
            }}
            onSubmit={(values) => {
              let formData = new FormData();
              let arr = Object.entries(values);
              arr.forEach(([key, val]) => {
                if (Array.isArray(val)) {
                  val.forEach((val1) => formData.append(key, val1));
                } else {
                  formData.append(key, JSON.stringify(val));
                }
              });
              if (!values.images) {
                formData.delete("images");
              }

              dispatch(
                updateAdminRoomThunk({ id: query?.id, roomData: formData })
              );
            }}
            validationSchema={UpdatedRoomSchema(
              roomDetail?.room?.images?.length || 0
            )}
          >
            {({
              values,
              touched,
              getFieldProps,
              handleChange,
              handleBlur,
              setFieldValue,
              errors,
              setValues,
              setFieldTouched,
            }) => {
              useEffect(() => {
                if (!roomDetail) return;
                setValues({
                  name: roomDetail?.room?.name,
                  price: roomDetail?.room?.price,
                  description: roomDetail?.room?.description,
                  address: roomDetail?.room?.address,
                  guestsCapacity: roomDetail?.room?.guestCapacity,
                  numOfBeds: roomDetail?.room?.numOfBeds,
                  internet: roomDetail?.room?.internet,
                  breakFast: roomDetail?.room?.breakFast,
                  airConditioned: roomDetail?.room?.airConditioned,
                  petsAllowed: roomDetail?.room?.petsAllowed,
                  images: values.images ? values.images : null,
                  category: roomDetail?.room?.category,
                });
              }, [roomDetail]);

              return (
                <Form>
                  <TextField
                    type="text"
                    label="name"
                    sx={{ marginY: "1rem" }}
                    {...getFieldProps("name")}
                    fullWidth
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    type="text"
                    label="description"
                    sx={{ marginY: "1rem" }}
                    {...getFieldProps("description")}
                    fullWidth
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                  />
                  <TextField
                    type="number"
                    label="price"
                    sx={{ marginY: "1rem" }}
                    {...getFieldProps("price")}
                    error={touched.price && Boolean(errors.price)}
                    helperText={touched.price && errors.price}
                    fullWidth
                    inputProps={{
                      min: 1,
                    }}
                  />
                  <TextField
                    type="text"
                    label="address"
                    sx={{ marginY: "1rem" }}
                    {...getFieldProps("address")}
                    error={touched.address && Boolean(errors.address)}
                    helperText={touched.address && errors.address}
                    fullWidth
                  />

                  <TextField
                    {...getFieldProps("guestsCapacity")}
                    label="Guest Capacity"
                    select
                    sx={{ marginY: "1rem" }}
                    fullWidth
                    error={
                      touched.guestsCapacity && Boolean(errors.guestsCapacity)
                    }
                    helperText={touched.guestsCapacity && errors.guestsCapacity}
                  >
                    {guestCapacity.map((el) => {
                      return (
                        <MenuItem key={el} value={el}>
                          {el}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                  <TextField
                    {...getFieldProps("numOfBeds")}
                    label="No. of Beds"
                    sx={{ marginY: "1rem" }}
                    select
                    fullWidth
                    error={touched.numOfBeds && Boolean(errors.numOfBeds)}
                    helperText={touched.numOfBeds && errors.numOfBeds}
                  >
                    {numofBeds.map((el) => {
                      return (
                        <MenuItem key={el} value={el}>
                          {el}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                  <TextField
                    {...getFieldProps("category")}
                    label="Category"
                    sx={{ marginY: "1rem" }}
                    select
                    fullWidth
                    error={touched.category && Boolean(errors.category)}
                    helperText={touched.category && errors.category}
                  >
                    {category.map((el) => {
                      return (
                        <MenuItem key={el} value={el}>
                          {/* {el.charAt(0).toUpperCase() + el.slice(1)} */}
                          {el}
                        </MenuItem>
                      );
                    })}
                  </TextField>

                  <FormGroup row={true}>
                    <FormControlLabel
                      control={<Checkbox checked={values.internet} />}
                      label="Internet"
                      name="internet"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <FormControlLabel
                      control={<Checkbox checked={values.breakFast} />}
                      label="Breakfast"
                      name="breakFast"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <FormControlLabel
                      control={<Checkbox checked={values.airConditioned} />}
                      label="Air Conditioned"
                      name="airConditioned"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <FormControlLabel
                      control={<Checkbox checked={values.petsAllowed} />}
                      label="Pets Allowed"
                      name="petsAllowed"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </FormGroup>

                  <MultipleImageUploadUpdate
                    setFieldValue={setFieldValue}
                    onBlur={handleBlur}
                    images={values.images || []}
                    errors={errors.images}
                    touched={touched.images}
                    setTouched={setFieldTouched}
                    uploadedImages={roomDetail?.room?.images || []}
                  />

                  <LoadingButton
                    sx={{ marginTop: "2rem" }}
                    variant="contained"
                    type="submit"
                    loading={UpdateLoading}
                  >
                    Update Room
                  </LoadingButton>
                </Form>
              );
            }}
          </Formik>
        </Paper>
      </Container>
    </Layout>
  );
};

export default UpdateRoom;

export const getServerSideProps = async (ctx) => {
  const session = await getSession({ req: ctx.req });
  if (!session || session.user.role !== "Admin") {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
