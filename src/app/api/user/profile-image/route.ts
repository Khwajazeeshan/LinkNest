import { NextResponse, NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import user from '@/src/models/user';
import { connectDB } from '@/src/config/dbConfig';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
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

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;

        // Define path to public/uploads
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (error) {
            // Directory might already exist
        }

        const filePath = join(uploadDir, filename);

        // We write the file manually instead of using multer because Next.js App Router 
        // doesn't support Express middleware like Multer out of the box.
        await writeFile(filePath, buffer);

        const profileImageUrl = `/uploads/${filename}`;

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
