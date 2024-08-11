import { connectDB } from "@/lib/db"
import { User } from "@/modals"
import { SignAccessToken } from "@/services/user.service"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const POST = async (request:Request)=>{
    const cookieStore = cookies()
    
    try {
        const body = await request.json()
        await connectDB()
        const user = await User.findOne({email:body.email})
        if(!user){
            return NextResponse.json({success:false,message:"User not found"}, {status:404})
        }
        if(user.password !== body.password){
            return NextResponse.json({success:false,message:"Password Incorrect"}, {status:404})
        }
        
        // cookieStore.set("talha", 'malik', {maxAge:60, httpOnly:true})
        const response = NextResponse.json({success:false,data:user}, {status:200})
      const token =  SignAccessToken(user?.id)
      console.log("user", token)
        response.cookies.set("user", token, {maxAge:60, httpOnly:true})
        return response 
    } catch (error) {
        return NextResponse.json({success: false, message:error}, {status:400})
    }
}