import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/src/config/dbConfig";
import Link from "@/src/models/link";
import User from "@/src/models/user";
import { VerifyToken } from "@/src/utils/VerifyToken"; // tumhara custom function

export async function GET(request: NextRequest) {
    await connectDB();

    try {

        // 2️⃣ verify token
        const UserId = VerifyToken(request);
        const user = await User.findById(UserId);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const links = await Link.find({ user: user._id });
        return NextResponse.json({
            data: links,
            success: true,
            message: "Links fetched successfully"
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}