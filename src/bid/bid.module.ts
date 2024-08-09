import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BidSchema } from './schema/bid.schema';
import { BidItemSchema } from './schema/bid-item.schema';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { BidGateWay } from './bid.gateway';
import { CommonModule } from 'src/common/common.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Bid', schema: BidSchema }]),
        MongooseModule.forFeature([{ name: 'BidItem', schema: BidItemSchema }]),
        CommonModule,
    ],
    providers: [
        BidService,
        BidGateWay,
    ],
    controllers: [BidController],
    exports:[BidService],
})
export class BidModule { }
