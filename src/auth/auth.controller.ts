import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ){}

    @Post('login')
    async login(@Body() user:any) {
        return this.authService.login(user);
    }
    
}
