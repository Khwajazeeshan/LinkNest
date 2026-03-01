import connectDB from "@/src/config/dbConfig";
import User from "@/src/models/user";
import Link from "@/src/models/link";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    await connectDB();

    try {
        const { userId, password } = await request.json();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: "Incorrect Password", success: false }, { status: 401 });
        }

        await Link.deleteMany({ user: userId });

        await User.findByIdAndDelete(userId);

        const response = NextResponse.json(
            { message: "Account Deleted Successfully", success: true },
            { status: 200 }
        );

        response.cookies.set("Accesstoken", "", { maxAge: 0 });
        response.cookies.set("RefreshToken", "", { maxAge: 0 });

        return response;

    } catch (error: any) {
        return NextResponse.json(
            { error: "Internal Server Error", success: false },
            { status: 500 }
        );
    }
}
