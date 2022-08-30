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
import MultipleImageUpload from "../../../components/MultipleImageUpload";
import RoomSchema from "../../../schema/roomSchema";
import { useDispatch, useSelector } from "react-redux";
import {
  createRoomThunk,
  getAdminCreateRoomState,
} from "../../../redux/features/AdminCreateRoomSlice";
import { useRouter } from "next/router";

const guestCapacity = [1, 2, 3, 4, 5];
const numofBeds = [1, 2, 3, 4, 5];

const category = ["King", "Twins", "Single"];

const CreateRoom = () => {
  const dispatch = useDispatch();

  const { success, loading, error } = useSelector(getAdminCreateRoomState);

  useEffect(() => {
    if (success) {
      toast.success("Room is created successfully", {
        position: "top-right",
      });
      router.push("/");
    }
    if (error) {
      toast.error("An Error Occured while creating Room", {
        position: "top-right",
      });
    }
  }, [success, error]);

  const router = useRouter();

  return (
    <Layout title="Create Room">
      <Container sx={{ marginTop: "5rem" }} maxWidth="lg">
        <Paper sx={{ padding: "1rem 2rem" }} elevation={2}>
          <Typography variant="h3" gutterBottom>
            Create Room
          </Typography>
          <Formik
            initialValues={{
              name: "Test Room",
              price: 2000,
              description: "Nice Room",
              address: "New Street",
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
              dispatch(createRoomThunk(formData));
            }}
            validationSchema={RoomSchema}
          >
            {({
              values,
              touched,
              getFieldProps,
              handleChange,
              handleBlur,
              setFieldValue,
              errors,
              setFieldTouched,
            }) => {
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

                  <MultipleImageUpload
                    setFieldValue={setFieldValue}
                    onBlur={handleBlur}
                    images={values.images || []}
                    errors={errors.images}
                    touched={touched.images}
                    setTouched={setFieldTouched}
                  />

                  <LoadingButton
                    loading={loading}
                    sx={{ marginTop: "2rem" }}
                    variant="contained"
                    type="submit"
                  >
                    Create Room
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

export default CreateRoom;
