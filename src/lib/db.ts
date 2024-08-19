import mongoose, { Mongoose } from "mongoose";

interface CachedConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}
const DB_URL = process.env.MONGODB_URL;

if (!DB_URL) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached: CachedConnection = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

// const connectionState = mongoose.connection.readyState;
export const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
          dbName: "webAuthentication",

    };

    cached.promise = mongoose.connect(DB_URL, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

// if (connectionState === 1) {
//   console.log("Already Connected ");
//   return;
// }
// if (connectionState === 2) {
//   console.log("Please wait Connecting..... ");
//   return;
// }
// try {
//   mongoose.connect(MONGODB_URL!, {
//     dbName: "webAuthentication",
//     bufferCommands: false,
//   });
//   console.log("DB Connected");
// } catch (error) {
//   console.log("Error: In Connection", error);
// }
