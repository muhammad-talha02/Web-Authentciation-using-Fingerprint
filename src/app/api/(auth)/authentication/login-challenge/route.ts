import { connectDB } from "@/lib/db";
import { Challenge } from "@/modals";
import { isAuthenticate } from "@/services/isAuthenticate.service";
import {
  generateAuthenticationOptions,
} from "@simplewebauthn/server";
import { Types } from "mongoose";
import { cookies } from "next/headers";

export const POST = async (request: Request) => {
  const token = cookies().get("user")?.value || "";
  const test = isAuthenticate(token);
  if (!test) {
    return Response.json({ success: false, message: "User not found" });
  }
  try {
    await connectDB();
    const body = await request.json();
    console.log("body", body);
    const payload = await generateAuthenticationOptions({
      rpID: "localhost",
    });
    console.log("payload", payload);
    const newChallenge = await Challenge.findOneAndUpdate(
      { userId: body?._id },
      { $set: {challenge: payload.challenge} }  ,
      {new:true}
    );
    console.log("NEw Update", newChallenge)
    return Response.json({ success: true, options: payload }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error }, { status: 400 });
  }
};
