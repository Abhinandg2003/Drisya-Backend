import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("DB Connected");
  });

  const connectionOptions = process.env.MONGODB_DB
    ? { dbName: process.env.MONGODB_DB }
    : {};

  await mongoose.connect(process.env.MONGODB_URI, connectionOptions);
};

export default connectDB;
