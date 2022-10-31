import mongoose = require('mongoose');
import { Context } from '../models/context';
import { VerifyAuthorization } from '../decorators/auth.decorator';
const Feed: mongoose.Model<any> = require('../models/feed');
const User: mongoose.Model<any> = require('../models/users');



export class FeedController {
    @VerifyAuthorization
    async getFeeds(args: any, ctx: Context) {
        const { first, cursor, distance } = args;
        const user = await User.findById(ctx._id);
        const feeds = await Feed.find({
            $and: [
                {
                    location: {
                        $near:
                        {
                            $geometry: user.location,
                            $minDistance: 0,
                            $maxDistance: distance ? distance : 1000
                        }
                    }
                },
                {
                    user: ctx._id
                },
                {
                    ignored: false
                },
                {
                    match: false,
                },
                cursor ? {
                    _id: { $gt: new mongoose.Types.ObjectId(cursor) }
                } : {}
            ],
        }).limit(first ? first : 5).populate('interests', '_id title addedBy').populate('ref_user').populate('ref_user.phone');



        console.log("trying to get feeds", feeds.length);

        return {
            feeds: feeds
        } as any;
    }
}