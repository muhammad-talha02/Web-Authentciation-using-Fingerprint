import { connectDB } from "@/lib/db";
import { Challenge } from "@/modals";
import { isAuthenticate } from "@/services/isAuthenticate.service";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { cookies } from "next/headers";

export const POST = async (request: Request) => {
  
  try {
    await connectDB();
    const user = await request.json();
    const payload = await generateAuthenticationOptions({
      rpID: "localhost",
    });

     await Challenge.findOneAndUpdate(
      { userId: user?._id },
      { $set: { challenge: payload.challenge } },
      { new: true }
    );
    return Response.json({ success: true, options: payload }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error }, { status: 400 });
  }
};
