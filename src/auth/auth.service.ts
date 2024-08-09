import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        public readonly userService: UserService,
        public readonly jwtService: JwtService
    ) { }
    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.getUser(email);
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, userId: user.userId };
        return {
            access_token: this.jwtService.sign(payload),
        }
    }
}
