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

export class FeedController {
    @VerifyAuthorization
    async getFeeds(args: any, ctx: Context) {
        const { first, cursor, distance, filters, interests,buildingId } = args;
     
        const user = await User.findById(ctx._id);


        let conditions: any[] = [
            {
                location: {
                    $near:
                    {
                        $geometry: user?.location,
                        $minDistance: 0,
                        $maxDistance: distance ? distance : 1000
                    }
                }
            },
            {
                user: ctx._id
            },
            cursor ? {
                _id: { $gt: new mongoose.Types.ObjectId(cursor) }
            } : {}
        ];

       
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
            if(interests.length > 0){
                conditions.push(
                    { "interests": { $in: interests } }
                )
            }
        }

        if(buildingId){
            conditions.push({
                buildingId: buildingId,
            });
        }

        // if (!filters && !interests) {
            conditions.push({
                ignored: false
            });

            conditions.push({
                match: false,
            });
        // }

        let applied_filters = {
            $and: [
                ...conditions,
            ]
        };


        const feeds = await Feed.find(applied_filters).limit(first || 5).populate('interests', '_id title addedBy').populate('ref_user').populate('state').populate('country').sort({_id:1});
  
        return {
            feeds: feeds
        } as any;
    }

    @VerifyAuthorization
    async getFeed(args: FeedVariables, ctx: Context) {
        const feed = await Feed.findOne({ $and: [{ user: args.userId }, { ref_user: args.refId }] }).populate('interests', '_id title addedBy').populate('ref_user').populate('state').populate('country');
        return { feed } as any;
    }
}