import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/src/config/dbConfig";
import Link from "@/src/models/link";
import User from "@/src/models/user";
import { VerifyToken } from "@/src/utils/VerifyToken";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    try {
        const UserId = VerifyToken(request);
        const user = await User.findById(UserId);
        if (!user) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
        }

        const { platform, accountLink } = await request.json();
        const { id } = await params;

        const link = await Link.findOne({ _id: id, user: user._id });
        if (!link) {
            return NextResponse.json({ success: false, message: "Link not found or unauthorized" }, { status: 404 });
        }

        link.platform = platform || link.platform;
        link.accountLink = accountLink || link.accountLink;
        await link.save();

        return NextResponse.json({ success: true, message: "Link updated successfully", data: link }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    try {
        const UserId = VerifyToken(request);
        const user = await User.findById(UserId);
        if (!user) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
        }

        const { id } = await params;
        const deletedLink = await Link.findOneAndDelete({ _id: id, user: user._id });
        if (!deletedLink) {
            return NextResponse.json({ success: false, message: "Link not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Link deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
