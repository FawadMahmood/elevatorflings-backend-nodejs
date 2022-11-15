import mongoose = require('mongoose');
import { Context } from '../models/context';
import { StatusType, UserType } from '../utils/types';

const Status: mongoose.Model<StatusType> = require('../models/status');

export class StatusController {
    async addStatus(args: { status: StatusType }, ctx: Context) {
        const status = new Status(args.status);
        status.save();
        return {
            success: true
        }
    }

    async getStatuses(args: any, ctx: Context) {
        const statuses = await Status.find();

        return {
            statuses,
        }
    }


    // @VerifyAuthorization
    // async getFeeds(args: any, ctx: Context) {
    //     const { first, cursor, distance, filters, interests } = args;
    //     const user = await User.findById(ctx._id);


    //     let conditions: any[] = [
    //         {
    //             location: {
    //                 $near:
    //                 {
    //                     $geometry: user?.location,
    //                     $minDistance: 0,
    //                     $maxDistance: distance ? distance : 1000
    //                 }
    //             }
    //         },
    //         {
    //             user: ctx._id
    //         },
    //         cursor ? {
    //             _id: { $gt: new mongoose.Types.ObjectId(cursor) }
    //         } : {}
    //     ];

    //     console.log("interests", interests);

    //     if (filters) {
    //         filters.map((_filter: { key: string, value: string }) => {
    //             conditions.push(
    //                 {
    //                     [_filter.key]: _filter.value
    //                 }
    //             )
    //         })
    //     }


    //     if (interests) {
    //         conditions.push(
    //             { "interests": { $in: interests } }
    //         )
    //     }

    //     if (!filters && !interests) {
    //         conditions.push({
    //             ignored: false
    //         });

    //         conditions.push({
    //             match: false,
    //         });
    //     }

    //     let applied_filters = {
    //         $and: [
    //             ...conditions,
    //         ]
    //     };


    //     const feeds = await Feed.find(applied_filters).limit(first ? first : 5).populate('interests', '_id title addedBy').populate('ref_user');


    //     return {
    //         feeds: feeds
    //     } as any;
    // }
}