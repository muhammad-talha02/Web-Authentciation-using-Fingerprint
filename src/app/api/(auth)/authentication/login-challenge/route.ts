import { connectDB } from "@/lib/db";
import { Challenge } from "@/modals";
import { generateAuthenticationOptions } from "@simplewebauthn/server";

export const POST = async (request: Request) => {
  
  try {
    await connectDB();
    const user = await request.json();
    const payload = await generateAuthenticationOptions({
      rpID: "web-authentciation-using-fingerprint.vercel.app",
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
