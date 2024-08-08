import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { BidController } from './bid/bid.controller';
import { BidService } from './bid/bid.service';
import { BidModule } from './bid/bid.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, BidModule, UserModule],
  controllers: [AppController, AuthController, BidController],
  providers: [AppService, AuthService, BidService],
})
export class AppModule {}
