import RoomModel from "../Models/RoomModel";
import ErrorHandler from "../utils/ErrorHandler";
import catchAsync from "../middlewares/catchAsync";
import ApiFeatures from "../utils/apiFeatures";
import fs from "fs";
import v2 from "../config/cloudinaryConfig";

const uploadMulitpleFiles = async (files) => {
  const promiseFileUploadArr = files.map((el) => {
    return v2.uploader.upload(el.path, { folder: "Bookit/Rooms" });
  });

  return Promise.all(promiseFileUploadArr);
};

const newRoom = catchAsync(async (req, res, next) => {
  const data = await uploadMulitpleFiles(req.files);
  req.files.forEach((el) => {
    fs.unlinkSync(el.path);
  });

  const images = data.map((el) => ({
    public_id: el.public_id,
    url: el.secure_url,
  }));

  let parsedBody = {};
  Object.entries(req.body).forEach((el) => {
    parsedBody[el[0]] = JSON.parse(el[1]);
  });
  const {
    name,
    price,
    description,
    address,
    guestsCapacity,
    internet,
    breakFast,
    airConditioned,
    petsAllowed,
    category,
  } = parsedBody;

  const newRoom = await RoomModel.create({
    name,
    price,
    description,
    address,
    guestsCapacity,
    internet,
    breakFast,
    airConditioned,
    petsAllowed,
    category,
    images: images,
    user: req.user.id,
  });

  res.status(200).json({
    success: true,
    newRoom: newRoom,
  });
});

const getAllRooms = catchAsync(async (req, res, next) => {
  const resPerPage = 4;
  const roomCount = await RoomModel.countDocuments();

  const apiFeatures = new ApiFeatures(RoomModel.find(), req.query)
    .search()
    .filter();

  let rooms = await apiFeatures.query;
  let filteredRoomsCount = rooms.length;

  apiFeatures.pagination(resPerPage);

  rooms = await apiFeatures.query.clone();

  res.status(200).json({
    roomCount,
    success: true,
    resPerPage,
    filteredRoomsCount,
    rooms,
  });
});

//get room by id
//

const getRoomById = catchAsync(async (req, res, next) => {
  const { id } = req.query;

  const room = await RoomModel.findById(id);

  if (!room) {
    return next(new ErrorHandler(`Room not Found with this id`, 404));
  }

  res.status(200).json({
    success: true,
    room,
  });
});

//update room by id

const updateRoomById = catchAsync(async (req, res, next) => {
  const { id } = req.query;

  const bodyData = {};

  Object.entries(req.body).forEach((el) => {
    bodyData[el[0]] = JSON.parse(el[1]);
  });

  if (req.files.length === 0) {
    let updatedRoom = await RoomModel.findByIdAndUpdate(id, bodyData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Room Updated SuccessFully",
    });
    return;
  } else {
    const data = await uploadMulitpleFiles(req.files);
    req.files.forEach((el) => {
      fs.unlinkSync(el.path);
    });
    const images = data.map((el) => ({
      public_id: el.public_id,
      url: el.secure_url,
    }));

    const room = await RoomModel.findOneAndUpdate(
      { _id: id },
      {
        $set: { ...bodyData },
        $push: { images: { $each: images } },
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: "Room Updated Successfully",
    });
    return;
  }
});

//delete room by id

const deleteMultipleFiles = async (images) => {
  try {
    await v2.api.delete_resources([...images]);
    return true;
  } catch (error) {
    console.log(error);
    throw new ErrorHandler("Error occured while deleting images", 500);
  }
};
const deleteRoomById = catchAsync(async (req, res, next) => {
  const { id } = req.query;

  const Room = await RoomModel.findById(id);

  const Allimages = Room.images.map((el) => el.public_id);

  const data = await deleteMultipleFiles(Allimages);

  if (data) {
    await RoomModel.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Room is Deleted SuccessFully",
    });
  }
});

const getAllRoomsAdmin = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 5, search } = req.query;
  // const totalDocs = await RoomModel.countDocuments();
  let rooms;
  let totalDocs;

  if (search) {
    rooms = await RoomModel.find({
      name: { $regex: `${search}`, $options: "$i" },
    })
      .limit(limit)
      .skip(page * limit - limit);
    totalDocs = await RoomModel.countDocuments({
      name: { $regex: `${search}`, $options: "$i" },
    });
  } else {
    rooms = await RoomModel.find({})
      .limit(limit)
      .skip(page * limit - limit);
    totalDocs = await RoomModel.countDocuments({});
  }
  res.status(200).json({
    success: true,
    rooms,
    totalRooms: totalDocs,
  });
});

export {
  getAllRooms,
  newRoom,
  getRoomById,
  updateRoomById,
  deleteRoomById,
  getAllRoomsAdmin,
};

// const {
//   name,
//   price,
//   description,
//   address,
//   guestsCapacity,
//   numOfBeds,
//   internet,
//   breakFast,
//   airConditioned,
//   petsAllowed,
//   images,
//   category,
// } = req.body;

// console.log(req.body.images);

// const room = await RoomModel.create({
//   name,
//   price,
//   description,
//   address,
//   guestsCapacity,
//   numOfBeds,
//   internet,
//   breakFast,
//   airConditioned,
//   petsAllowed,
//   images,
//   category,
//   user: req.user._id,
// });

// res.status(200).json({
//   success: true,
//   // room,
// });
