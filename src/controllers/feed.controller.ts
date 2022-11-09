import mongoose = require('mongoose');
import { Context } from '../models/context';
import { VerifyAuthorization } from '../decorators/auth.decorator';
const Feed: mongoose.Model<any> = require('../models/feed');
const User: mongoose.Model<any> = require('../models/users');



export class FeedController {
    @VerifyAuthorization
    async getFeeds(args: any, ctx: Context) {
        const { first, cursor, distance, filters, interests } = args;
        const user = await User.findById(ctx._id);


        let conditions: any[] = [
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
        ];

        console.log("interests", interests);

        if (filters) {
            filters.map((_filter: { key: string, value: string }) => {
                conditions.push(
                    {
                        [_filter.key]: _filter.value
                    }
                )
            })
        }


        if (interests) {
            conditions.push(
                { "interests": { $in: interests } }
            )
        }




        let applied_filters = {
            $and: [
                ...conditions,
            ]
        };


        const feeds = await Feed.find(applied_filters).limit(first ? first : 5).populate('interests', '_id title addedBy').populate('ref_user');


        return {
            feeds: feeds
        } as any;
    }
}