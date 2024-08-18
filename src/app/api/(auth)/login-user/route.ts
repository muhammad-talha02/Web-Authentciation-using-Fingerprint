import { connectDB } from "@/lib/db";
import { User } from "@/modals";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  await connectDB();
  try {
    const body = await request.json();
    const user = await User.findOne({ email: body.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    if (user.password !== body.password) {
      return NextResponse.json(
        { success: false, message: "Password Incorrect" },
        { status: 404 }
      );
    }

    const response = NextResponse.json(
      { success: true, data: user },
      { status: 200 }
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "SOmething wrong!" },
      { status: 400 }
    );
  }
};
