import { Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { BidService } from './bid.service';
import { Bid } from './schema/bid.schema';
import { BidItem } from './schema/bid-item.schema';

@Controller('api/bid')
export class BidController {
    constructor(
        private readonly bidService: BidService,
    ) { }
    @Post()

    async createBid(@Body() bid: Bid): Promise<Bid> {
        return await this.bidService.createBid(bid);
    };
    @Get()
    async getBid(@Query() query?: any) {
        return await this.bidService.getBid(query?.id);
    }
    @Put()
    async updateBid(@Param('id') id: string, @Body() bid: Bid): Promise<Bid> {
        return await this.bidService.updateBid(id, bid);
    }
    @Patch(':bidId/participants/:participantId/bidAmounts/:bidItemId')
    async updateBidAmount(
        @Param('bidId') bidId: string,
        @Param('participantId') participantId: string,
        @Param('bidItemId') bidItemId: string,
        @Body('amount') amount: number
    ): Promise<Bid | null> {
        return this.bidService.updateBidAmount(bidId, participantId, bidItemId, amount);
    }

    @Post(':bidId/participants/:participantId')
    async addParticipant(
        @Param('participantId') participantId: string,
        @Param('bidId') bidId: string,
        @Body('bidAmounts') bidAmounts: { bidItemId: string, amount: number }[]
    ): Promise<Bid> {
        return this.bidService.addParticipant(participantId, bidId, bidAmounts);
    }
    @Post(':bidId/item')
    async addBidItem(@Param('bidId') bidId: string, @Body() bidItem: any): Promise<any> {
        return await this.bidService.addItem(bidId, bidItem);
    }
    @Put(':bidId/items/:itemId')
    async updateBidItem(@Param('bidId') bidId: string, @Param('itemId') itemId: string, @Body() bidItem: any): Promise<BidItem> {
        return await this.bidService.updateBidItem(bidId, itemId, bidItem);
    }

    @Put(':bidId')
    async updateBidEndTime(
        @Param('bidId') bidId: any,
        @Body('endTime') endTime: Date
    ): Promise<Bid | null> {
        return await this.bidService.updateBidEndTime(bidId, endTime);
    }

    @Get(':bidId/leaderboard')
    async getLeaderboard(@Param('bidId') bidId: string): Promise<any> {
        return this.bidService.getLeaderboard(bidId);
    }

    @Get(':bidId/summary')
    async getBidSummary(@Param('bidId') bidId: string): Promise<any> {
        return this.bidService.getBidSummary(bidId);
    }
    @Post(':bidId/invitation')
    async sendInvitation(@Body() body: any): Promise<any> {
        return this.bidService.sendInvitation(body);
    }
}
