import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
const jwt = require('jsonwebtoken');

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
        const validatedUser = await this.validateUser(user.email, user.password);
        if (!validatedUser) {
            throw new Error('Invalid credentials');
        }
        const payload = { email: user.email, sub: validatedUser.username };
        return jwt.sign(payload,
            process.env.JWT_SECRET,
            {
                expiresIn: '1h',
            }
        );
    };
}

