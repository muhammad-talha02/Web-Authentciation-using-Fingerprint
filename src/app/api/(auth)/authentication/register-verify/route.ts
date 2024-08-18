import { connectDB } from "@/lib/db";
import { Challenge, User } from "@/modals";
import { verifyRegistrationResponse } from "@simplewebauthn/server";

export const POST = async (request: Request) => {
  try {
    await connectDB();
    const body = await request.json();
    const { userId, cred } = body;
    const res: any = await Challenge.findOne({ userId });
    const verificationResult = await verifyRegistrationResponse({
      expectedChallenge: res?.challenge,
      expectedRPID: "web-authentciation-using-fingerprint.vercel.app",
      expectedOrigin: "https://web-authentciation-using-fingerprint.vercel.app/",
      response: cred,
    });

    if (!verificationResult?.verified) {
      return Response.json({ message: "Not verified" });
    }
    const passkeySave = {
      ...verificationResult.registrationInfo,
      credentialPublicKey: Buffer.from(
        verificationResult?.registrationInfo?.credentialPublicKey || ""
      ).toString("base64"),
      attestationObject: Buffer.from(
        verificationResult?.registrationInfo?.attestationObject || ""
      ).toString("base64"),
    };
    // Save passkeySave to MongoDB
     await User.findByIdAndUpdate(
      { _id: userId },
      { passkey: passkeySave },
      { new: true }
    );
    return Response.json({ verified: true, message: "Verified Successfully" });
  } catch (error) {
    return Response.json({ success: false, message: "Something wrong" });
  }
};
