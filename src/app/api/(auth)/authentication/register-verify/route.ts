import { connectDB } from "@/lib/db"
import { Challenge } from "@/modals"
import { verifyRegistrationResponse } from "@simplewebauthn/server"
import { cookies } from "next/headers"

export const POST = async(request:Request)=>{

    const token = cookies().get('user')?.value || ''
    try {
        await connectDB()
const {userId, cred} = await request.json()
const res = await Challenge.find({userId})
console.log(res, "userId")
// const verificationResult = await verifyRegistrationResponse({
// expectedChallenge:res?.challenge,
// expectedRPID:"http://localhost:8000",
// expectedOrigin:'localhost',
// response:cred
// })


    } catch (error) {
        
    }
}