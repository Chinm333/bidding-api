import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { CommonService } from 'src/common/common.service';

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
        return await this.userModel.create(user);
    }
}
