import { Schema, Document } from 'mongoose';

export const BidItemSchema = new Schema({
    bidItemId:{
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    basePrice: {
        type: Number,
        required: true,
    },
    currentBid: {
        type: Number,
        default: 0,
    },
    bidder: {
        type: String,
    },
});

export interface BidItem extends Document {
    bidItemId: string;
    description: string;
    basePrice: number;
    currentBid: number;
    bidder: string;
}