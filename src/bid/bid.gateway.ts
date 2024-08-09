import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class BidGateWay implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    constructor() { }
    afterInit(server: any) {
        console.log('WebSocket Initialized');
    }
    handleConnection(client: any, ...args: any[]) {
        console.log('Client connected:', client.id);
    }
    handleDisconnect(client: any) {
        console.log('Client disconnected:', client.id);
    }
    @SubscribeMessage('joinBid')
    handleJoinBid(client: Socket, bidId: string) {
        client.join(bidId);
        this.server.to(bidId).emit('newParticipant', bidId);
    };
    @SubscribeMessage('placeBid')
    handlePlaceBid(client: Socket, payload: { bidId: string, bidItemId: string, amount: number }) {
        const { bidId, bidItemId, amount } = payload;
        this.server.to(bidId).emit('bidPlaced', { bidItemId, amount });
    }
    @SubscribeMessage('leaveBid')
    handleLeaveBid(client: Socket, bidId: string) {
        client.leave(bidId);
        this.server.to(bidId).emit('participantLeft', bidId);
    }
}