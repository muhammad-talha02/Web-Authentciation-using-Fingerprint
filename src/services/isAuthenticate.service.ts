import jwt, { Secret } from "jsonwebtoken";

//? Verify Access Token

export const verifyAccessToken = (token: string) => {
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN as Secret);
  return decoded;
};

export const isAuthenticate = (token: string) => {
    console.log("decoded", token)
  const isVerified = verifyAccessToken(token);
  if (isVerified) {
    return true;
  } else {
    return false;
  }
};