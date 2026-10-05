import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
    timestamps: true,
    versionKey: false,
    toJSON: {
        transform: (_doc, ret: Record<string, unknown>) => {
            delete ret.password;
            delete ret.otp;
            delete ret.otpExpiresAt;
            delete ret.__v;
            delete ret.refreshToken;
            return ret;
        },
    },
})
export class User {
    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ select: false })
refreshToken?: string;

    @Prop({ required: true, unique: true, lowercase: true, trim: true })
    email: string;

    @Prop({ trim: true })
    phone?: string;

    @Prop({ default: 'Viewer', enum: ['Admin', 'Editor', 'Viewer'] })
    role?: 'Admin' | 'Editor' | 'Viewer';

    @Prop({ default: 'Employee', enum: ['Employee', 'Student', 'CEO'] })
    profession?: 'Employee' | 'Student' | 'CEO';

    @Prop({ type: [String], default: [] })
    hobbies?: string[];

    @Prop({ select: false })
    password?: string;

    @Prop({ default: false })
    isVerified: boolean;

    @Prop({ select: false })
    otp?: string;

    @Prop({ select: false })
    otpExpiresAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);