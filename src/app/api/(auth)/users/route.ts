import { connectDB } from "@/lib/db"
import { User } from "@/modals"
import { NextResponse } from "next/server"

export const GET = async ()=>{

    try {
        await connectDB()

        const users = await User.find()
        return Response.json(users, {status:200})
    } catch (error) {
        return NextResponse.json('Error in fetching data' + error, {status:404} )
    }
}
