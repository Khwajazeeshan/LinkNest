import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/src/config/dbConfig";
import Link from "@/src/models/link";
import User from "@/src/models/user";
import { VerifyToken } from "@/src/utils/VerifyToken"; // tumhara custom function

export async function POST(request: NextRequest) {
    await connectDB();

    try {

        // 2️⃣ verify token
        const UserId = VerifyToken(request);
        const user = await User.findById(UserId);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // 3️⃣ get links from body
        const { links } = await request.json();

        const platforms = links.map((l: { platform: string }) => l.platform);
        const existlink = await Link.findOne({ user: user._id, platform: { $in: platforms } });

        if (existlink) {
            return NextResponse.json(
                { success: false, message: `Platform '${existlink.platform}' already exists` },
                { status: 400 }
            );
        }

        // 5️⃣ save new links
        await Promise.all(
            links.map((l: { platform: string; accountLink: string }) =>
                Link.create({
                    user: user._id,
                    platform: l.platform,
                    accountLink: l.accountLink,
                })
            )
        );

        return NextResponse.json({ success: true, message: "Links saved successfully" });
    } catch (error) {
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}