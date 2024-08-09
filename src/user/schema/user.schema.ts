import { Schema, Document } from 'mongoose';

export const UserSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['bid_creator', 'bidder'],
        requried: true,
    }
});

export interface User extends Document {
    email: string;
    username: string;
    password: string;
    role: 'bid_creator' | 'bidder';
}