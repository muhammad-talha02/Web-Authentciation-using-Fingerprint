import { connectDB } from "@/lib/db"
import { User } from "@/modals"
import { NextResponse } from "next/server"

export const POST = async (request:Request)=>{

    try {
        const body = await request.json()
        await connectDB()
        const newUser =await User.create(body)
        return NextResponse.json({success:true,data:newUser}, {status:201})
    } catch (error) {
        return NextResponse.json({success: false, message:error}, {status:400})
    }
}