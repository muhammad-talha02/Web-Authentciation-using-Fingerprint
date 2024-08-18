import mongoose from "mongoose";

const MONGODB_URL = process.env.NEXT_PUBLIC_MONGODB_URL;

export const connectDB = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Already Connected ");
    return;
  }
  if (connectionState === 2) {
    console.log("Please wait Connecting..... ");
    return;
  }

  try {
    mongoose.connect(MONGODB_URL!, {
      dbName: "webAuthentication",
      bufferCommands: false,
    });
    console.log("DB Connected");
  } catch (error) {
    console.log("Error: In Connection", error);
  }
};
