import { connectDB } from "@/lib/db";
import { Challenge } from "@/modals";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { Types } from "mongoose";

export const POST = async (request: Request) => {
  try {
    await connectDB();
    const user = await request.json();
    const payload = await generateRegistrationOptions({
      rpID: "web-authentciation-using-fingerprint.vercel.app",
      rpName: "Local Machine",
      userName: user?.username,
    });
    await Challenge.create({
      userId: new Types.ObjectId(user?._id),
      challenge: payload.challenge,
    });
    return Response.json({ success: true, options: payload }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error }, { status: 400 });
  }
};
