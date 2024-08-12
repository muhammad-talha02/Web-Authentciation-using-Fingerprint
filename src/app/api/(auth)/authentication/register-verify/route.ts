import { connectDB } from "@/lib/db"
import { verifyRegistrationResponse } from "@simplewebauthn/server"
import { cookies } from "next/headers"

export const POST = async(request:Request)=>{

    const token = cookies().get('user')?.value || ''
    try {
        await connectDB()
const {userId, cred} = await request.json()
// const await 
// const verificationResult = await verifyRegistrationResponse({

// })


    } catch (error) {
        
    }
}