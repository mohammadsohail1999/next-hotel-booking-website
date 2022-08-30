import mongoose from "mongoose";

const dbConnect = () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  mongoose
    .connect(process.env.MONGO_URI)
    .then((res) => {
      console.log("Db is Connected Successfully");
    })
    .catch((err) => {
      console.log(err);
      console.log("error occured while connecting with db");
    });
};

export default dbConnect;
