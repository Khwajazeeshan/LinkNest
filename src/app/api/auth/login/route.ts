import connectDB from "@/src/config/dbConfig";
import User from "@/src/models/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { GenerateToken } from "@/src/utils/GenerateToken";
import { sendEmail } from "@/src/services/mailer";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { email, password } = await request.json();

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: "Incorrect password", success: false }, { status: 401 });
        }

        // Check if verified
        if (!user.isVerified) {
            // Send verification email
            await sendEmail({
                email,
                emailType: "VERIFY",
                userId: user._id.toString()
            });
            return NextResponse.json({ message: "Please Check your inbox and verify your email first", success: false }, { status: 403 });
        }

        const { accessToken, refreshToken } = GenerateToken(user._id);

        // Remove password from response
        const userWithoutPassword = {
            _id: user._id,
            Username: user.Username,
            email: user.email,
            isVerified: user.isVerified,
            isAdmin: user.isAdmin
        };

        const response = NextResponse.json({
            message: "Login successful",
            user: userWithoutPassword,
            success: true
        }, { status: 200 });

        const cookieOptions: any = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        };

        response.cookies.set("Accesstoken", accessToken, {
            ...cookieOptions,
            maxAge: 60 * 30, // 30 minutes
        });

        response.cookies.set("RefreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: 60 * 60 * 24 * 3, // 3 days
        });

        return response;
    } catch (error: any) {
        console.error("Login Error:", error);
        return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
    }
}