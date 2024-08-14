import { connectDB } from "@/lib/db"
import { Challenge } from "@/modals"
import { isAuthenticate } from "@/services/isAuthenticate.service"
import { generateRegistrationOptions } from "@simplewebauthn/server"
import { Types } from "mongoose"
import { cookies } from "next/headers"

export const POST = async (request:Request)=>{

    // const token = cookies().get('user')?.value || ''
    // const user = isAuthenticate(token)
    // if(!user){
    //     return Response.json({success:false, message:""})
    // }
    try {
        await connectDB()
        const user = await request.json()
        const payload = await generateRegistrationOptions({
            rpID:"localhost",
            rpName:'Local Machine',
            userName:user?.userName
        })

        const newChallenge = await Challenge.create({
            userId:new Types.ObjectId(user?._id),
            challenge:payload.challenge
        })
        return Response.json({success:true,options:payload}, {status:201})
    } catch (error) {
        return Response.json({success:false,error}, {status:400})
        
    }
}