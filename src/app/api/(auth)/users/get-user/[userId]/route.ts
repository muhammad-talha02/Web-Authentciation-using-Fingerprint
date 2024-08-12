import { connectDB } from "@/lib/db";
import { User } from "@/modals";
import { isAuthenticate } from "@/services/isAuthenticate.service";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

console.log(process.env.MONGODB_URL);
export const GET = async (
  request: NextRequest,
  { params }: { params: { userId: string } }
) => {
  const cookieStore = cookies();
  const { userId } = params;
  const userToken = cookieStore.get("user")?.value || "";
  if (userToken && isAuthenticate(userToken)) {
    try {
      await connectDB();
      const user = await User.findById(userId);
      const response = NextResponse.json(user, { status: 200 });
      return response;
    } catch (error) {
      return new NextResponse("Error in fetching data" + error, {
        status: 404,
      });
    }
  } else {
    return NextResponse.json(
      { success: false, message: "Please login to access this" },
      { status: 401 }
    );
  }
};
