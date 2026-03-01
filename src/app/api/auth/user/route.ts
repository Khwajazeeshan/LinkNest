import { connectDB } from '@/src/config/dbConfig';
import { NextRequest, NextResponse } from "next/server";
import { VerifyToken } from "@/src/utils/VerifyToken";
import User from '@/src/models/user';

export async function GET(request: NextRequest) {
    await connectDB();
    try {
        const userId = VerifyToken(request)
        const user = await User.findById(userId).select("-password")
        if (!user) {
            return NextResponse.json({ error: "User not found", success: false }, { status: 404 })
        }
        return NextResponse.json({ data: user, success: true, message: "User found" }, { status: 200 })
    } catch (error: any) {
        const isAuthError = error.message.includes("Token not found") || error.message.includes("jwt");
        return NextResponse.json(
            { error: error.message, success: false },
            { status: isAuthError ? 401 : 500 }
        )
    }
}