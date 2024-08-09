import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
@Injectable()

export class CommonService {
    generateId(length?) {
        if (typeof length === 'undefined') {
            length = 8;
        }
        return crypto.randomBytes(length).toString('hex');
    }
}

