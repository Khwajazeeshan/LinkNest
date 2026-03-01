import { NextResponse } from 'next/server';
import { connectDB } from '@/src/config/dbConfig';
import User from '@/src/models/user';
import Link from '@/src/models/link';

export async function GET(request: Request, context: { params: Promise<{ handler: string }> }) {
    await connectDB();

    try {
        // Extract the handler from the dynamic route parameter
        const { handler } = await context.params;

        // Find the user by their Username (handler)
        const user = await User.findOne({ Username: handler }).select('-password -__v -createdAt -updatedAt');

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        // Find all links associated with this user
        const links = await Link.find({ user: user._id }).select('-__v -user');

        return NextResponse.json({
            success: true,
            data: {
                user: {
                    Username: user.Username,
                    email: user.email,
                    profileImage: user.profileImage,
                },
                links: links,
            },
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error fetching handler data:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
