import catchAsync from "../middlewares/catchAsync";
import v2 from "../config/cloudinaryConfig";
import RoomModel from "../Models/RoomModel";

export const imageDeleteController = catchAsync(async (req, res, next) => {
  const { public_id, roomId } = req.query;

  await v2.uploader.destroy(public_id);

  const updateRoom = await RoomModel.findByIdAndUpdate(
    roomId,
    {
      $pull: { images: { public_id } },
    },
    { safe: true, upsert: true }
  );
  res.status(200).json({
    success: true,
    updateRoom,
  });
});
