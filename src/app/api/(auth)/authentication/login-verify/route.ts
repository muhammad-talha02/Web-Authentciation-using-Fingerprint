import { connectDB } from "@/lib/db";
import { Challenge, User } from "@/modals";
import { isAuthenticate } from "@/services/isAuthenticate.service";
import { generateAuthenticationOptions, generateRegistrationOptions, verifyAuthenticationResponse, VerifyAuthenticationResponseOpts } from "@simplewebauthn/server";
import { Types } from "mongoose";
import { cookies } from "next/headers";

export const POST = async (request: Request) => {
  const token = cookies().get('user')?.value || ''
//   const user = isAuthenticate(token)
//   if(!user){
//       return Response.json({success:false, message:"User not found"})
//   }
  try {
    await connectDB();
    const body = await request.json();
    const {userId, cred} = body
    const res: any = await Challenge.findOne({userId});
    const user: any = await User.findById(userId);
    
    console.log("challenege", res)
    console.log("userha", user)
    console.log("cred", cred)
    const front = {
      id: cred.id,
      rawId: cred.rawId,
      response: {
        authenticatorData: Buffer.from(cred.response.authenticatorData, 'base64'),
        clientDataJSON: Buffer.from(cred.response.clientDataJSON, 'base64'),
        signature: Buffer.from(cred.response.signature, 'base64'),
        userHandle: cred.response.userHandle ? Buffer.from(cred.response.userHandle, 'base64') : undefined
      },
      type: cred.type,
      clientExtensionResults: cred.clientExtensionResults,
      authenticatorAttachment: cred.authenticatorAttachment
    };
    const options:VerifyAuthenticationResponseOpts = {
      expectedChallenge:res.challenge,
      expectedOrigin:"http://localhost:3000", 
      expectedRPID:"localhost",
      response:cred,
      authenticator:{
      ...user.passkey,
      credentialPublicKey: Buffer.from(user.passkey.credentialPublicKey, 'base64'),
      attestationObject: Buffer.from(user.passkey.attestationObject, 'base64')
      }
     }
     console.log("Options", options);
    const result = await verifyAuthenticationResponse(options);
    console.log("final result", result);


    if(!result.verified){
        return Response.json({ success:false, message:"failed to login passkey" }, { status: 401 });
    }
    return Response.json({ success:true, message:"User Passed" }, { status: 200 });
  } catch (error) {
    console.log("Error", error)
    return Response.json({ success: false, error }, { status: 400 });
  }
};
