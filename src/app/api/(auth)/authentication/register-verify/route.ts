import { connectDB } from "@/lib/db";
import { Challenge, User } from "@/modals";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { cookies } from "next/headers";

export const POST = async (request: Request) => {
  const token = cookies().get("user")?.value || "";
  try {
    await connectDB();
    const body = await request.json();
    const {userId, cred} = body
    const res: any = await Challenge.findOne({userId});
    const verificationResult = await verifyRegistrationResponse({
        expectedChallenge: res?.challenge,
        expectedRPID: "localhost",
        expectedOrigin: "http://localhost:3000",
        response: cred,
    });
    console.log("verificationResult", verificationResult);

    if(!verificationResult?.verified){
        return Response.json({message:"Not verified"})
    }
    const passkeySave = {
      ...verificationResult.registrationInfo,
      credentialPublicKey: Buffer.from(verificationResult?.registrationInfo?.credentialPublicKey ||'').toString('base64'),
      attestationObject: Buffer.from(verificationResult?.registrationInfo?.attestationObject || '').toString('base64')
    };
    // Save passkeySave to MongoDB
    const updateUser = await User.findByIdAndUpdate({_id:userId}, {passkey:passkeySave},{new:true})
console.log("PAsskey save", updateUser)
    return Response.json({verified:true,message:'Verified Successfully'})
} catch (error) {

    console.log(error)
      return Response.json({success:false,message:'Something wrong'})

  }
};
