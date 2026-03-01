import connectDB from "@/src/config/dbConfig";
import User from "@/src/models/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/src/services/mailer";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { Username, email, password } = await request.json();

        // Check if user exists
        const existingUsername = await User.findOne({ Username });
        if (existingUsername) {
            return NextResponse.json({ message: "Username Already Exists", success: false }, { status: 400 });
        }

        const existingUseremail = await User.findOne({ email });
        if (existingUseremail) {
            return NextResponse.json({ message: "Email Already Exists", success: false }, { status: 400 });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = new User({
            Username,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        // Send verification email
        await sendEmail({
            email,
            emailType: "VERIFY",
            userId: savedUser._id.toString()
        });

        return NextResponse.json({
            message: "Verify your email to continue",
            success: true
        }, { status: 201 });

    } catch (error: any) {
        console.error("Signup Error:", error);
        return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
    }
}