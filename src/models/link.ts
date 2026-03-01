import mongoose, { Schema, Document } from 'mongoose';

export interface ILink extends Document {
    user: Schema.Types.ObjectId;
    platform: string;
    accountLink: string;
}

const LinkSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    platform: { type: String, required: true },
    accountLink: { type: String, required: true },
});

export default mongoose.models.Link || mongoose.model<ILink>('Link', LinkSchema);
