import mongoose = require('mongoose');
import { Context } from '../models/context';
const User: mongoose.Model<UserType> = require('../models/users');
const Thread: mongoose.Model<any> = require('../models/thread');
const Match: mongoose.Model<any> = require('../models/match');

import { RedisPubSub } from 'graphql-redis-subscriptions';
import { UserType } from '../utils/types';
const pubsub = new RedisPubSub({
  connection:{
    port: 6379, 
    host: '127.0.0.1', 
    password: ''
  }
});

export class SocketController {
    registerSocket(args: { userId: string }, ctx: Context) {
       return pubsub.asyncIterator(`${'USER_EVENT'}.${args.userId}`)
    }

    async emitMatchUpdate(match_id:any, ctx: Context) {    
        const match = await Match.findById(match_id).populate('participants',"_id name photoUrl");
        match.participants.forEach((element:UserType) => {
          pubsub.publish(
            `${'USER_EVENT'}.${element._id}`, 
            { userEvent:
               {
                type:"KNOCK",
                payload:match,
            }
          });
        });
    }

    async emitMessageUpdate(thread:any, ctx: Context) {
       const user = await User.findById(thread.sender._id);
        thread.participants.forEach((element:any) => {
          console.log("sending thread to pubsub",`${'USER_EVENT'}.${element}`,{
            type:"MESSAGE",
            payload:{...thread._doc,sender:user},
        });
          
          pubsub.publish(
            `${'USER_EVENT'}.${element}`, 
            { userEvent:
               {
                type:"MESSAGE",
                payload:{...thread._doc,sender:user},
            }
          });
        });
       

    }
}