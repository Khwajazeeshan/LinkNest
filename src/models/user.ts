import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    Username: string;
    email: string;
    password: string;
    isVerified: boolean;
    isAdmin: boolean;
    forgotPasswordToken: string | null;
    forgotPasswordTokenExpiry: Date | null;
    verifyToken: string | null;
    verifyTokenExpiry: Date | null;
    createdAt: Date;
    updatedAt: Date;
    profileImage?: string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
    {
        Username: {
            type: String,
            required: [true, "Please provide a Username"],
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        forgotPasswordToken: String,
        forgotPasswordTokenExpiry: Date,
        verifyToken: String,
        verifyTokenExpiry: Date,
        profileImage: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
