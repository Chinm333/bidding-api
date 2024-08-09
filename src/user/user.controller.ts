import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';

@Controller('api/user')
export class UserController {

    constructor(
        private readonly userService: UserService,
    ) { }
    @Post('register')
    async register(@Body() user: User): Promise<User> {
        return await this.userService.createUser(user);
    }

    @Get(':email')
    async getUser(@Param('email') email: string): Promise<User> {
        return await this.userService.getUser(email);
    }
}
