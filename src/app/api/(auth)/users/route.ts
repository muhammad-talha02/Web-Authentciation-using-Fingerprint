import { connectDB } from "@/lib/db"
import { User } from "@/modals"
import { NextResponse } from "next/server"

console.log(process.env.MONGODB_URL)
export const GET = async ()=>{

    try {
        await connectDB()

        const users = await User.find()
        return Response.json(users, {status:200})
    } catch (error) {
        return new NextResponse('Error in fetching data' + error, {status:404} )
    }
}
