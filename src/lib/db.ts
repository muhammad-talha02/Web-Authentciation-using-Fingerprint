import mongoose from "mongoose";

const MONGODB_URL = process.env.NEXT_PUBLIC_MONGODB_URL;

export const connectDB = async () => {

  if (!MONGODB_URL) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    )
  }
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Already Connected ");
    return;
  }
  if (connectionState === 2) {
    console.log("Please wait Connecting..... ");
    return;
  }
console.log("Db: ->", process.env.NEXT_PUBLIC_MONGODB_URL)
console.log("Test: ->", process.env.TEST)
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
