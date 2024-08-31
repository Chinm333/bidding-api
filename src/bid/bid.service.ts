import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bid } from './schema/bid.schema';
import { CommonService } from 'src/common/common.service';
import { BidItem } from './schema/bid-item.schema';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class BidService {

    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    constructor(
        @InjectModel('Bid') private readonly bidModel: Model<Bid>,
        @InjectModel('BidItem') private readonly bidItemModel: Model<BidItem>,
        private commonService: CommonService,
    ) { }
    async createBid(bid: any): Promise<Bid> {
        const bidId = this.commonService.generateId(4);
        bid.bidId = bidId;
        bid.items = bid.items.map((item: any) => {
            return {
                ...item,
                bidItemId: this.commonService.generateId(4),
            };
        });
        return await this.bidModel.create(bid);
    }
    async getBid(bidId?: string) {
        if (bidId !== undefined) {
            return await this.bidModel.findOne({ bidId: bidId });
        } else {
            return await this.bidModel.find();
        }
    }

    async updateBidItem(bidId: string, itemId: string, update: Partial<BidItem>): Promise<any> {
        const updatedBid = await this.bidModel.findOneAndUpdate(
            { bidId: bidId, 'items.bidItemId': itemId },
            { $set: { 'items.$': { ...update, bidItemId: itemId } } },
            { new: true }
        );
        return updatedBid;
    }

    async addItem(bidId: string, newItem: BidItem): Promise<any> {
        const res = await this.bidModel.findByIdAndUpdate(
            bidId,
            { $push: { items: newItem } },
            { new: true }
        ).then(bid => bid?.items[bid.items.length - 1]);
        return res;
    }

    async updateBid(id: string, bid: Bid): Promise<Bid> {
        return await this.bidModel.findByIdAndUpdate(id, bid, { new: true });
    }
    async updateBidAmount(bidId: string, participantId: string, bidItemId: string, amount: number): Promise<Bid | null> {
        return await this.bidModel.findOneAndUpdate(
            { bidId, 'participants.participantId': participantId },
            { $set: { 'participants.$.bidAmounts.$[elem].amount': amount } },
            {
                new: true,
                arrayFilters: [{ 'elem.bidItemId': bidItemId }]
            }
        );
    }

    async addParticipant(
        participantId: string,
        bidId: string,
        bidAmounts: { bidItemId: string, amount: number }[]
    ): Promise<Bid> {
        const bid = await this.bidModel.findOne({ bidId });

        if (!bid) {
            throw new Error('Bid not found');
        }

        for (const bidAmount of bidAmounts) {
            const { bidItemId, amount } = bidAmount;

            const bidItem = bid.items.find(item => item.bidItemId === bidItemId);

            if (bidItem && bidItem.currentBid < amount) {
                await this.bidModel.updateOne(
                    { bidId, 'items.bidItemId': bidItemId },
                    { $set: { 'items.$.currentBid': amount } }
                );
            }
        }

        const existingParticipant = bid.participants.find(p => p.participantId === participantId);

        if (existingParticipant) {
            return await this.bidModel.findOneAndUpdate(
                { bidId, 'participants.participantId': participantId },
                {
                    $set: {
                        'participants.$.bidAmounts': bidAmounts,
                    },
                },
                {
                    new: true,
                }
            );
        } else {
            return await this.bidModel.findOneAndUpdate(
                { bidId },
                {
                    $push: {
                        participants: {
                            participantId,
                            bidAmounts,
                            status: 'pending',
                        },
                    },
                },
                {
                    new: true,
                }
            );
        }
    }

    async getParticipant(bidId: string, participantId: string): Promise<Bid | null> {
        return await this.bidModel.findOne(
            { bidId, 'participants.participantId': participantId },
            { 'participants.$': 1 }
        );
    }
    async getLeaderboard(bidId: string): Promise<any> {

        const bid = await this.bidModel.findOne({ bidId }).exec();

        if (!bid) {
            throw new Error(`Bid with ID ${bidId} not found.`);
        }

        const leaderboard = bid.participants.map(participant => {
            const totalBidAmount = participant.bidAmounts.reduce((sum, bidAmount) => sum + bidAmount.amount, 0);
            return {
                participantId: participant.participantId,
                totalBidAmount,
            };
        });

        leaderboard.sort((a, b) => b.totalBidAmount - a.totalBidAmount);

        return leaderboard;
    }

    async getBidSummary(bidId: string): Promise<any> {

        const bid = await this.bidModel.findOne({ bidId }).exec();

        if (!bid) {
            throw new Error(`Bid with ID ${bidId} not found.`);
        }

        const summary = {
            bidId: bid.bidId,
            title: bid.title,
            startTime: bid.startTime,
            endTime: bid.endTime,
            status: bid.status,
            items: bid.items,
            participants: bid.participants.map(participant => ({
                participantId: participant.participantId,
                bidAmounts: participant.bidAmounts,
                status: participant.status,
            })),
        };

        return summary;
    }
    async sendInvitation(body: any): Promise<any> {
        const emails = Array.isArray(body.emails) ? body.emails : [body.emails];
        try {
            await Promise.all(emails.map(email =>
                this.transporter.sendMail({
                    to: email,
                    from: process.env.EMAIL,
                    subject: 'Invitation to Participate in Bid',
                    text: 'You are invited to participate in a bid. Please check the details on our website.',
                })
            ));
            return { message: 'Invitations sent successfully!' };
        } catch (error) {
            console.error('Error sending invitations:', error);
            throw new Error('Failed to send invitations.');
        }
    }

    async updateBidEndTime(bidId: string, endTime: Date): Promise<Bid | null> {
        const updatedBid = await this.bidModel.findOneAndUpdate(
            { bidId: bidId },
            { endTime },
            { new: true }
        );
        return updatedBid;
    }
}
