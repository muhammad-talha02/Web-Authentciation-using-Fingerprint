import jwt, { Secret } from "jsonwebtoken";
import { ObjectId } from "mongoose";

//? Generate Access Token
export const SignAccessToken = (userId: ObjectId) => {
  const token = jwt.sign({ userId }, process.env.ACCESS_TOKEN as Secret, {
    expiresIn: 60,
  });
  return token;
};

