import { connectDB } from "@/lib/db";
import { Challenge, User } from "@/modals";
import { SignAccessToken } from "@/services/user.service";
import {
  verifyAuthenticationResponse,
  VerifyAuthenticationResponseOpts,
} from "@simplewebauthn/server";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
    try {
    await connectDB();
    const body = await request.json();
    const { userId, cred } = body;
    const res: any = await Challenge.findOne({ userId });
    const user: any = await User.findById(userId);

    const options: VerifyAuthenticationResponseOpts = {
      expectedChallenge: res.challenge,
      expectedOrigin: "https://web-authentciation-using-fingerprint.vercel.app/",
      expectedRPID: "web-authentciation-using-fingerprint.vercel.app",
      response: cred,
      authenticator: {
        ...user.passkey,
        credentialPublicKey: Buffer.from(
          user.passkey.credentialPublicKey,
          "base64"
        ),
        attestationObject: Buffer.from(
          user.passkey.attestationObject,
          "base64"
        ),
      },
    };

    const result = await verifyAuthenticationResponse(options);
    if (!result.verified) {
      return Response.json(
        { success: false, message: "failed to login passkey" },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      { success: true, message: "User Passed" },
      { status: 200 }
    );
    const token = SignAccessToken(user?.id);
    response.cookies.set("user", token, { maxAge: 60 * 60, httpOnly: true });
    return response
  } catch (error) {

    return Response.json({ success: false, error }, { status: 400 });
  }
};
