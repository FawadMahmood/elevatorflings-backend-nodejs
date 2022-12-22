import mongoose = require('mongoose');
import { Context } from '../models/context';
import { VerifyAuthorization } from '../decorators/auth.decorator';
import { UserType } from '../utils/types';
import { SocketController } from './socket.controller';
const Feed: mongoose.Model<any> = require('../models/feed');
const Match: mongoose.Model<any> = require('../models/match');
const socketController = new SocketController();

type FeedVariables = {
    id: string;
    isKnock:boolean;
}

export class MatchController {
    @VerifyAuthorization
    async addKnock(args: FeedVariables, ctx: Context) {
        const {id,isKnock} = args;
        const feed  = await Feed.findById(id);
        const ref_feed  = await Feed.findOne({$and:[{user:feed.ref_user},{ref_user:feed.user}]}); 

        await Feed.updateOne({
            _id:feed._id,
        },
        {
            $set:isKnock? {
                match:true,
            }:{
                ignored:true,
            }
        });

        if(isKnock === true && ref_feed.match){
            const _ = await Match.findOne({$and:[{
                participants:{$in:[feed.user]}
            },{
                participants:{$in:[feed.ref_user]}
            }]});

            if(!_){ 
                const match = new Match({
                    participants:[feed.user,feed.ref_user]
                });
                await match.save();
                socketController.emitMatchUpdate(match._id,ctx);
            }
          
        }
       return {
        success:true
       } as any
    }
}