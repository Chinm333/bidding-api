import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { CommonService } from 'src/common/common.service';
const jwt = require('jsonwebtoken');

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private userModel: Model<any>,
        private commonService: CommonService,
    ) { }
    async getUser(email: string) {
        return await this.userModel.findOne({ email: email });
    }

    async createUser(user: User) {
        const username = this.commonService.generateId(4);
        user.username = username;
        const response = await this.userModel.create(user);
        const payload = { email: user.email, sub: user.username };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        return {
            access_token: token,
            user: {
                email: user.email,
                username: user.username
            }
        }
    }
}
