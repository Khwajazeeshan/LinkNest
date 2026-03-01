import { NextResponse, NextRequest } from 'next/server';
import { put } from '@vercel/blob'; // Import Vercel Blob
import user from '@/src/models/user';
import { connectDB } from '@/src/config/dbConfig';
import { VerifyToken } from "@/src/utils/VerifyToken";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const userId = await VerifyToken(request);

        const formData = await request.formData();
        const file = formData.get('image') as File | null;

        if (!file) {
            return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
        }

        // 1. Upload to Vercel Blob instead of writing to disk
        const blob = await put(file.name, file, {
            access: 'public',
        });

        // 2. The URL returned by Vercel Blob
        const profileImageUrl = blob.url;

        // 3. Update the user in Database
        await user.findByIdAndUpdate(userId, { profileImage: profileImageUrl });

        return NextResponse.json({
            success: true,
            message: 'Image uploaded successfully',
            imageUrl: profileImageUrl
        });

    } catch (error: any) {
        console.error('Upload Error:', error);
        return NextResponse.json({ success: false, message: error?.message || 'Upload failed' }, { status: 500 });
    }
}
