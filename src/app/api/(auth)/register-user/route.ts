import { connectDB } from "@/lib/db"
import { User } from "@/modals"
import { NextResponse } from "next/server"

export const POST = async (request:Request)=>{
    await connectDB()
    try {
        const body = await request.json()
        const newUser =await User.create(body)
        console.log("Register", newUser)
        return NextResponse.json({success:true,data:newUser}, {status:201})
    } catch (error) {
        console.log("Failed in Register", error)
        return NextResponse.json({success: false, message:"Failed"}, {status:400})
    }
}