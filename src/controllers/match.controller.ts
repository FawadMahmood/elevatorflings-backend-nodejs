import mongoose = require('mongoose');
import { Context } from '../models/context';
import { VerifyAuthorization } from '../decorators/auth.decorator';
import { UserType } from '../utils/types';
const Feed: mongoose.Model<any> = require('../models/feed');
const User: mongoose.Model<UserType> = require('../models/users');

type FeedVariables = {
    userId: string;
    refId: string;
}

export class MatchController {
    @VerifyAuthorization
    async getFeed(args: FeedVariables, ctx: Context) {
        const feed = await Feed.findOne({ $and: [{ user: args.userId }, { ref_user: args.refId }] }).populate('interests', '_id title addedBy').populate('ref_user').populate('state').populate('country');
        return { feed } as any;
    }
}