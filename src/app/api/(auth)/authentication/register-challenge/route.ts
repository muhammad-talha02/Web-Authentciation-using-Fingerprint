import { connectDB } from "@/lib/db"
import { Challenge } from "@/modals"
import { isAuthenticate } from "@/services/isAuthenticate.service"
import { generateRegistrationOptions } from "@simplewebauthn/server"
import { cookies } from "next/headers"

export const POST = async(request:Request)=>{

    // const token = cookies().get('user')?.value || ''
    // const user = isAuthenticate(token)
    // if(!user){
    //     return Response.json({success:false, message:""})
    // }
    try {
        await connectDB()
        const {user} = await request.json()
        const payload = await generateRegistrationOptions({
            rpID:"localhost",
            rpName:'Local Machine',
            userName:user?.name
        })
        console.log(user, "userId")

        const newChallenge = await Challenge.create({
            userId:user,
            challenge:new Map(Object.entries(payload.challenge))
        })
        return Response.json({success:true,options:payload, data:newChallenge}, {status:201})
    } catch (error) {
        return Response.json({success:false,error}, {status:400})
        
    }
}