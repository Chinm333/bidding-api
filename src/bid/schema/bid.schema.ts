import { Schema, Document } from 'mongoose';
import { BidItemSchema, BidItem } from './bid-item.schema';

export const BidSchema = new Schema({
    bidId: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    items: [BidItemSchema],
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    creator: {
        type: String,
        required: true,
    },
    participants: [{
        participantId: {
            type: String,
            required: true,
        },
        bidAmounts: [{
            bidItemId: {
                type: String,
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            }
        }],
        status: {
            type: String,
            enum: ['accepted', 'rejected', 'pending'],
            default: 'pending',
        }
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'closed'],
        default: 'draft',
    }
});

export interface Bid extends Document {
    bidId: string;
    title: string;
    items: BidItem[];
    startTime: Date;
    endTime: Date;
    creator: string;
    participants: {
        participantId: string;
        bidAmounts: {
            bidItemId: string;
            amount: number;
        }[];
        status: 'accepted' | 'rejected' | 'pending';
    }[];
    status: 'draft' | 'published' | 'closed';
};